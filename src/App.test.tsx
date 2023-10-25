import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';

jest.mock('axios'); // Mock Axios

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate
}));

const initialState = {
  global: {
    pageLoading: false,
    menu: []
  },
  posts: {
    loadedResult: {
      currentPageType: 'post_list',
      currentPageNumber: 1
    },
    posts: []
  }
};
const mockStore = configureStore();
let store;

describe('main', () => {
  it('renders title', () => {
    store = mockStore(initialState);

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
    const helloText = getByText('Life With a Celiac');
    expect(helloText).toBeInTheDocument();
  });
});
