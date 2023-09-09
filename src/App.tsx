import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu/Menu';
import { Post } from './components/Post/Post';
import { PostList } from './components/PostList/PostList';
import { Search } from './components/Search/Search';

export interface IPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  link: string;
  content: {
    rendered: string;
  };
  slug: string;
  _embedded: {
    'wp:featuredmedia': [
      {
        media_details: {
          sizes: {
            medium: {
              source_url: string;
            };
            medium_large: {
              source_url: string;
            };
            large: {
              source_url: string;
            };
            full: {
              source_url: string;
            };
            '1536x1536': {
              source_url: string;
            };
          };
        };
      }
    ];
  };
  _links: {
    self: [
      {
        href: string;
      }
    ];
  };
  excerpt: {
    rendered: string;
  };
}

export interface IMenuItem {
  ID: number;
  title: string;
  url: string;
  object: string; // "category", "post"
  object_id: string; // if it's category, this is the category ID
  child_items: Array<IMenuItem>;
}

function App() {
  const GA_TRACKING_ID = 'G-LVVQ1G3RR2';
  ReactGA.initialize(GA_TRACKING_ID);

  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [totalPostCount, setTotalPostCount] = useState<number | undefined>(
    undefined
  );
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [menu, setMenu] = useState<Array<IMenuItem>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    loadPosts();
    loadMenus();
  }, []);

  const onPostClick = (id: number) => {
    console.log('====onPostClick', id);
    const post = posts.find((post) => {
      return post.id === id;
    });
    setTotals(undefined);
    const route = post?.link.replace('https://www.erime.eu', '/ng');
    route && navigate(route);
  };

  const onMenuClick = (url: string, menuType: string, objectId: string) => {
    console.log('====onMenuClick', url, menuType, objectId);
    menuType === 'category' && loadCategoryPosts(objectId);
    const route = url?.replace('https://www.erime.eu', '/ng');
    route && navigate(route);
  };

  const onSearch = (searchString: string) => {
    console.log('====onSearch', searchString);
    loadSearchPosts(searchString);
    navigate(`/ng/language/en/?s=${searchString}`);
  };

  async function loadPosts() {
    try {
      const response = await axios.get(
        'https://www.erime.eu/wp-json/wp/v2/posts?_embed'
      );
      console.log(response);
      setPosts(response.data);
      setTotals(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadCategoryPosts(categoryId: string) {
    try {
      const response = await axios.get(
        `https://www.erime.eu/wp-json/wp/v2/posts?_embed&categories=${categoryId}`
      );
      console.log(response);
      setPosts(response.data);
      setTotals(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadSearchPosts(searchString: string) {
    try {
      const response = await axios.get(
        `https://www.erime.eu/wp-json/wp/v2/posts?_embed&search=${searchString}`
      );
      console.log(response);
      setPosts(response.data);
      setTotals(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMenus() {
    try {
      const response = await axios.get(
        'https://www.erime.eu/wp-json/menus/v1/menus/menu_en'
      );
      console.log(response);
      setMenu(response.data.items);
    } catch (error) {
      console.error(error);
    }
  }

  const setTotals = (response: any) => {
    setTotalPostCount(!!response ? +response.headers['x-wp-total'] : undefined);
    setTotalPages(
      !!response ? +response.headers['x-wp-totalpages'] : undefined
    );
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='page_column'>
          <div>
            <div className='row no_margin'>
              <div
                className='col-9 col-md-7 col-lg-4 pointer'
                onClick={() => navigate(`/ng`)}
              >
                <div className='App-logo'>🍪</div>
                <div className='App-title'>Life With a Celiac</div>
              </div>
              <div className='col-3 col-md-1 col-lg-2 social'>
                <a
                  href='https://www.instagram.com/life_with_a_celiac/'
                  target='_blank'
                  rel='noreferrer'
                >
                  🦋
                </a>
              </div>
              <div className={`col-5 col-md-4 col-lg-3`}>
                <Search onSearch={onSearch} />
              </div>
              <div className={'col-7 col-md-12 col-lg-3'}>
                <Menu menuItems={menu} onClickItem={onMenuClick} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className='page_column'>
        <Routes>
          <Route
            path='/ng'
            element={<PostList posts={posts} onClickItem={onPostClick} />}
          />
          <Route path='/ng/language/en/recipes/*' element={<Post />} />
          <Route path='/ng/language/en/destinations/*' element={<Post />} />
          <Route
            path='/ng/language/en/category/*'
            element={<PostList posts={posts} onClickItem={onPostClick} />}
          />
          <Route
            path='/ng/language/en/*'
            element={<PostList posts={posts} onClickItem={onPostClick} />}
          />
        </Routes>
      </div>
      <footer>
        {totalPages &&
          totalPostCount &&
          `🎉 Total pages ${totalPages}, Total posts ${totalPostCount}`}
      </footer>
    </div>
  );
}

export default App;
