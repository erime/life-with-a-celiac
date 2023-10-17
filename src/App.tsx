import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu/Menu';
import { PageNav } from './components/PageNav/PageNav';
import { DUMMY_POST, Post } from './components/Post/Post';
import { PostList } from './components/PostList/PostList';
import { Search } from './components/Search/Search';
import { Config } from './config';
import { PostService } from './services/Posts.service';
import { loadResult as dispatchLoadResult } from './store/postSlice';

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
  slug: string;
  object: string; // "category", "post"
  object_id: string; // if it's category, this is the category ID
  child_items: Array<IMenuItem>;
}

export enum PageType {
  POST = 'post',
  POST_LIST = 'post_list',
  CATEGORY = 'category',
  SEARCH = 'search'
}

export interface ILoadResult {
  currentPageType: PageType;
  categoryId?: string;
  searchString?: string;
  currentPageNumber: number;
}

function App() {
  const GA_TRACKING_ID = 'G-LVVQ1G3RR2';
  ReactGA.initialize(GA_TRACKING_ID);

  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [activePost, setActivePost] = useState<IPost>();
  const [totalPostCount, setTotalPostCount] = useState<number | undefined>(
    undefined
  );
  const [loadResult, setLoadResult] = useState<ILoadResult | undefined>(
    undefined
  );
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [menu, setMenu] = useState<Array<IMenuItem>>([]);

  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadPosts = useCallback(async (page?: number) => {
    try {
      const usedPage = page ? page : 1;
      setPageLoading(true);
      setPosts([DUMMY_POST, DUMMY_POST, DUMMY_POST]);
      const response = await PostService.loadPosts(page);
      setPosts(response.data);
      setLoadResult({
        currentPageType: PageType.POST_LIST,
        currentPageNumber: usedPage
      });
      dispatch(
        dispatchLoadResult({
          currentPageType: PageType.POST_LIST,
          currentPageNumber: usedPage
        })
      );
      setTotals(response);
      setPageLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    //loadPosts();
    loadMenus();
  }, [loadPosts]);

  /**
   * Post has been clicked in the list
   * Callback from PostList or the menu
   *
   * @param url
   * @param slug
   */
  const onPostClick = (url: string, slug: string) => {
    const route = url.replace(Config.DOMAIN_URL, '/ng');
    route && navigate(route);
  };

  /**
   * Post component has been loaded
   *
   * Callback from the Post component
   */
  const onPostLoad = (slug: string) => {
    setTotals(undefined);
    loadPost(slug);
    window.scrollTo(0, 0);
  };

  const onPostListLoad = (
    lang: string | undefined,
    category: string | undefined,
    searchString: string | null,
    pageNum: string | undefined
  ) => {
    console.log('====onPostListLoad', lang, category, searchString, pageNum);
    if (!lang && !searchString && !category) {
      navigate('/ng/language/en/'); // if language is not defined, redirect
      return;
    }
    if (searchString && !category) {
      onSearch(searchString, pageNum ? +pageNum : undefined);
      return;
    }
    if (category) {
      loadCategoryPostsBySlug(category, pageNum ? +pageNum : undefined);
      pageNum &&
        navigate(
          `/ng/language/en/category/recipes/diet/${category}/page/${pageNum}`
        );
      return;
    }
    loadPosts(pageNum ? +pageNum : undefined);
    window.scrollTo(0, 0);
  };

  const onMenuClick = (
    url: string,
    menuType: string,
    objectId: string,
    slug: string
  ) => {
    console.log('====onMenuClick', url, menuType, objectId, slug);
    //menuType === 'category' && loadCategoryPosts(objectId); // if it has a category, load posts for that category
    //menuType !== 'category' && onPostClick(url, slug); // if it doesn't have a category, it's a post
    const route = url?.replace(Config.DOMAIN_URL, '/ng');
    route && navigate(route);
  };

  const onSearch = (searchString: string, page?: number) => {
    console.log('====onSearch', searchString);
    loadSearchPosts(searchString, page);
    page && navigate(`/ng/language/en/page/${page}?s=${searchString}`);
    !page && navigate(`/ng/language/en/?s=${searchString}`);
  };

  const onPageClicked = (page: number) => {
    switch (loadResult?.currentPageType) {
      case PageType.CATEGORY: {
        loadResult.categoryId && loadCategoryPosts(loadResult.categoryId, page);
        // navigate(
        //   `/ng/language/en/category/recipes/diet/${loadResult.categoryId}/page/${page}`
        // );
        break;
      }
      case PageType.SEARCH: {
        // loadResult.searchString &&
        //   loadSearchPosts(loadResult.searchString, page);
        navigate(`/ng/language/en/page/${page}?s=${loadResult.searchString}`);
        break;
      }
      case PageType.POST_LIST: {
        loadPosts(page);
        navigate(`/ng/language/en/page/${page}`);
        break;
      }
    }
  };

  async function loadCategoryPostsBySlug(slug: string, page?: number) {
    try {
      const usedPage = page ? page : 1;
      setPageLoading(true);
      const response = await PostService.loadCategoryBySlug(slug);
      console.log('====category', response);
      response?.data?.[0]?.id &&
        loadCategoryPosts(response?.data?.[0]?.id, usedPage);
    } catch (error) {
      console.error(error);
      setPageLoading(false);
    } finally {
    }
  }
  async function loadCategoryPosts(categoryId: string, page?: number) {
    try {
      const usedPage = page ? page : 1;
      setPageLoading(true);
      const response = await PostService.loadCategoryPosts(categoryId, page);
      setPosts(response.data);
      setLoadResult({
        currentPageType: PageType.CATEGORY,
        categoryId: categoryId,
        currentPageNumber: usedPage
      });
      setTotals(response);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  }

  async function loadSearchPosts(searchString: string, page?: number) {
    try {
      const usedPage = page ? page : 1;
      setPageLoading(true);
      const response = await PostService.loadSearchPosts(searchString, page);
      setPosts(response.data);
      setLoadResult({
        currentPageType: PageType.SEARCH,
        searchString: searchString,
        currentPageNumber: usedPage
      });
      setTotals(response);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
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

  /**
   * Loads a post from the API
   *
   * @param slug
   */
  async function loadPost(slug: string) {
    try {
      setPageLoading(true);
      const response = await PostService.loadPost(slug);
      setActivePost(response.data.length > 0 ? response.data[0] : undefined);
      setLoadResult({ currentPageType: PageType.POST, currentPageNumber: 1 });
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  }

  /**
   * Sets total posts and total pages from the API response headers
   *
   * @param response
   */
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
                onClick={() => {
                  navigate(`/ng`);
                  loadPosts();
                }}
              >
                <div className='App-logo'>🍪</div>
                <div className='App-title'>{Config.TITLE}</div>
              </div>
              <div className='col-3 col-md-1 col-lg-2 social'>
                <a href={Config.INSTAGRAM_URL} target='_blank' rel='noreferrer'>
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
            path='/'
            element={
              <PostList
                posts={posts}
                loading={pageLoading}
                onClickItem={onPostClick}
                loadData={onPostListLoad}
              />
            }
          />
          <Route
            path='/ng'
            element={
              <PostList
                posts={posts}
                loading={pageLoading}
                onClickItem={onPostClick}
                loadData={onPostListLoad}
              />
            }
          />
          <Route
            path='/ng/language/:lang/:mainCategory/:slug/*'
            element={
              <Post
                post={activePost}
                loading={pageLoading}
                loadData={onPostLoad}
              />
            }
          />
          <Route
            path='/ng/language/:lang/category/recipes/diet/:category/*'
            element={
              <PostList
                posts={posts}
                loading={pageLoading}
                onClickItem={onPostClick}
                loadData={onPostListLoad}
              />
            }
          />
          <Route
            path='/ng/language/:lang/page/:pageNum'
            element={
              <PostList
                posts={posts}
                loading={pageLoading}
                onClickItem={onPostClick}
                loadData={onPostListLoad}
              />
            }
          />
          <Route
            path='/ng/language/:lang/*'
            element={
              <PostList
                posts={posts}
                loading={pageLoading}
                onClickItem={onPostClick}
                loadData={onPostListLoad}
              />
            }
          />
        </Routes>
      </div>
      <footer>
        {loadResult && totalPages && totalPostCount && (
          <PageNav
            pageClicked={onPageClicked}
            currentPage={loadResult.currentPageNumber}
            totalPages={totalPages}
            totalPostCount={totalPostCount}
          />
        )}
      </footer>
    </div>
  );
}

export default App;
