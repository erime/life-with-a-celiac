import React, { Suspense, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { PostListItem } from './components/PostListItem/PostListItem';
import axios from 'axios';
import ReactGA from 'react-ga';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import { PostList } from './components/PostList/PostList';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Post } from './components/Post/Post';
import { Search } from './components/Search/Search';
import { Menu } from './components/Menu/Menu';

export interface IPost {
  id: number;
  date: string
  title: {
    rendered: string
  };
  link: string;
  content: {
    rendered: string;
  }
  slug: string;
  _embedded: {
    "wp:featuredmedia": [{
      media_details: {
        sizes: {
          medium: {
            source_url: string;
          }
          medium_large: {
            source_url: string;
          }
          large: {
            source_url: string;
          }
          full: {
            source_url: string;
          }
          "1536x1536": {
            source_url: string;
          }
        }
      }
    }];
  };
  _links: {
    self: [{
      href: string;
    }]
  }
  excerpt: {
    rendered: string;
  }
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
  const [menu, setMenu] = useState<Array<IMenuItem>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    getPosts();
    getMenus();
  }, [])

  const onPostClick = (id: number) => {
    console.log('====onPostClick', id)
    const post = posts.find((post) => {
      return post.id === id;
    })
    const route = post?.link.replace('https://www.erime.eu', '/ng');
    route && navigate(route);
  }

  const onMenuClick = (url: string, menuType: string, objectId: string) => {
    console.log('====onMenuClick', url, menuType, objectId);
    menuType === 'category' && getCategoryPosts(objectId);
    const route = url?.replace('https://www.erime.eu', '/ng');
    route && navigate(route);
  }

  const onSearch = (searchString: string) => {
    console.log('====onSearch', searchString);
    getSearchPosts(searchString);
    navigate(`/ng/language/en/?s=${searchString}`);
  }

  async function getPosts() {
    try {
      const response = await axios.get('https://www.erime.eu/wp-json/wp/v2/posts?_embed');
      console.log(response);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategoryPosts(categoryId: string) {
    try {
      const response = await axios.get(`https://www.erime.eu/wp-json/wp/v2/posts?_embed&categories=${categoryId}`);
      console.log(response);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getSearchPosts(searchString: string) {
    try {
      const response = await axios.get(`https://www.erime.eu/wp-json/wp/v2/posts?_embed&search=${searchString}`);
      console.log(response);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getMenus() {
    try {
      const response = await axios.get('https://www.erime.eu/wp-json/menus/v1/menus/menu_en');
      console.log(response);
      setMenu(response.data.items);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <header className="App-header row">
        <div className='col-md-6'>
          <img src={logo} className="App-logo" alt="logo" />
          <span className="App-title" >Life With a Celiac</span>
        </div>
        <div className='col-md-6'>
          <div className='row'>
            <div className='col-4'>social 🎉</div>
            <div className={`col-8`}><Search onSearch={onSearch} /></div>
            <div className={'col-12'}><Menu menuItems={menu} onClickItem={onMenuClick} /></div>
          </div>
        </div>
      </header>
      <div className='posts'>
        <Routes>
          <Route path="/ng" element={<PostList posts={posts} onClickItem={onPostClick} />} />
          <Route path="/ng/language/en/recipes/*" element={<Post />} />
          <Route path="/ng/language/en/destinations/*" element={<Post />} />
          <Route path="/ng/language/en/category/*" element={<PostList posts={posts} onClickItem={onPostClick} />} />
          <Route path="/ng/language/en/*" element={<PostList posts={posts} onClickItem={onPostClick} />} />
        </Routes>
      </div>
      <footer>🎉 footer</footer>
    </div>
  );
}

export default App;
