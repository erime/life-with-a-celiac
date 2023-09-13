import p1 from '../fixtures/post1.json';
import p2 from '../fixtures/post2.json';
import p3 from '../fixtures/post3.json';
import p4 from '../fixtures/post4.json';

describe('template spec', () => {
  it('passes', () => {
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
    ).as('postsCall');

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
    ).as('postsCall');

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
    ).as('postsCall');

    cy.visit('/');

    cy.wait('@menuCall');
    cy.wait('@postsCall');
  });
});
