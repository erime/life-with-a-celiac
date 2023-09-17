import p1 from '../fixtures/post1.json';
import p2 from '../fixtures/post2.json';
import p3 from '../fixtures/post3.json';
import p4 from '../fixtures/post4.json';

describe('Posts view', () => {
  it('Shows posts and paging works', () => {
    cy.intercept('GET', 'https://www.erime.eu/wp-json/menus/v1/menus/menu_en', {
      fixture: 'menu.json'
    }).as('menuCall');

    cy.intercept(
      'GET',
      'https://www.erime.eu/wp-json/wp/v2/posts?_embed&page=1',
      {
        body: [p1, p2, p3],
        headers: {
          'X-Wp-Total': '9',
          'X-Wp-Totalpages': '3'
        }
      }
    ).as('postsCall1');

    cy.intercept(
      'GET',
      'https://www.erime.eu/wp-json/wp/v2/posts?_embed&page=2',
      {
        body: [p2, p3, p4],
        headers: {
          'X-Wp-Total': '9',
          'X-Wp-Totalpages': '3'
        }
      }
    ).as('postsCall2');

    cy.intercept(
      'GET',
      'https://www.erime.eu/wp-json/wp/v2/posts?_embed&page=3',
      {
        body: [p3, p4, p1],
        headers: {
          'X-Wp-Total': '9',
          'X-Wp-Totalpages': '3'
        }
      }
    ).as('postsCall3');

    cy.visit('/');

    cy.wait('@menuCall'); // menu API should be called
    cy.wait('@postsCall1'); // posts page 1 should be called

    cy.get('h1').should('have.length', 3); // 3 posts should be visible
    cy.get('h1').first().should('contain.text', 'Broccoli'); // first post is "Broccoli"
    cy.get('footer > button').should('have.length', 3); // 3 pages should be in the footer
    cy.get('footer > button').first().should('be.disabled'); // first page button should be disabled

    cy.get('footer > button').eq(1).click();
    cy.wait('@postsCall2'); // posts page 2 should be called
    cy.get('h1').should('have.length', 3); // 3 posts should be visible
    cy.get('h1').first().should('contain.text', 'Paris'); // first post is "Paris"
    cy.get('footer > button').should('have.length', 3); // 3 pages should be in the footer
    cy.get('footer > button').eq(1).should('be.disabled'); // second page button should be disabled

    cy.get('footer > button').eq(2).click();
    cy.wait('@postsCall3'); // posts page 3 should be called
    cy.get('h1').should('have.length', 3); // 3 posts should be visible
    cy.get('h1').first().should('contain.text', 'Fonio'); // first post is "Fonio"
    cy.get('footer > button').should('have.length', 3); // 3 pages should be in the footer
    cy.get('footer > button').eq(2).should('be.disabled'); // third page button should be disabled

    cy.get('footer > button').first().click();
    cy.get('h1').should('have.length', 3); // 3 posts should be visible
    cy.get('h1').first().should('contain.text', 'Broccoli'); // first post is "Broccoli"
    cy.get('footer > button').should('have.length', 3); // 3 pages should be in the footer
    cy.get('footer > button').first().should('be.disabled'); // first page button should be disabled
  });
});
