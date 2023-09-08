import React, { useEffect, useState } from 'react';
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

function App() {

  const GA_TRACKING_ID = 'G-LVVQ1G3RR2';
  ReactGA.initialize(GA_TRACKING_ID);

  const [posts, setPosts] = useState<Array<IPost>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    getPosts();
  }, [])

  const onClickItem = (id: number) => {
    console.log('====onClickItem', id)
    const post = posts.find((post) => {
      return post.id === id;
    })
    const route = post?.link.replace('https://www.erime.eu', '/ng');
    route && navigate(route);
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

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
          <span className="App-title" >Life With a Celiac</span>
        </div>
        <div>
          <span>menu 🎉 </span>
          <span>social 🎉</span>
          <span>Search 🎉 </span>
        </div>
      </header>
      <div className='posts'>
        <Routes>
          <Route path="/ng" element={<PostList posts={posts} onClickItem={onClickItem} />} />
          <Route path="/ng/language/en/*" element={<Post />} />
        </Routes>
      </div>
      <footer>🎉 footer</footer>
    </div>
  );
}

export default App;
