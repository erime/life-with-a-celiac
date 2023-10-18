import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu/Menu';
import { PageNav } from './components/PageNav/PageNav';
import { DUMMY_POST, MyPost } from './components/Post/Post';
import { PostList } from './components/PostList/PostList';
import { Search } from './components/Search/Search';
import { Config } from './config';
import { PostService } from './services/Posts.service';
import { setPageLoading } from './store/globalSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  loadResult as dispatchLoadResult,
  setActivePost,
  setPosts
} from './store/postSlice';

export interface Post {
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

export interface MenuItem {
  ID: number;
  title: string;
  url: string;
  slug: string;
  object: string; // "category", "post"
  object_id: string; // if it's category, this is the category ID
  child_items: Array<MenuItem>;
}

export enum PageType {
  POST = 'post',
  POST_LIST = 'post_list',
  CATEGORY = 'category',
  SEARCH = 'search'
}

export interface LoadResult {
  currentPageType: PageType;
  categoryId?: string;
  searchString?: string;
  currentPageNumber: number;
}

function App() {
  const GA_TRACKING_ID = 'G-LVVQ1G3RR2';
  ReactGA.initialize(GA_TRACKING_ID);

  const [totalPostCount, setTotalPostCount] = useState<number | undefined>(
    undefined
  );
  const loadResult = useAppSelector((state) => state.posts.loadedResult);

  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [menu, setMenu] = useState<Array<MenuItem>>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loadPosts = useCallback(
    async (page?: number) => {
      try {
        const usedPage = page ? page : 1;
        dispatch(setPageLoading(true));
        dispatch(setPosts([DUMMY_POST, DUMMY_POST, DUMMY_POST]));
        const response = await PostService.loadPosts(page);
        dispatch(setPosts(response.data));
        dispatch(
          dispatchLoadResult({
            currentPageType: PageType.POST_LIST,
            currentPageNumber: usedPage
          })
        );
        setTotals(response);
        dispatch(setPageLoading(false));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setPageLoading(false));
      }
    },
    [dispatch]
  );

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
    const route = url?.replace(Config.DOMAIN_URL, '/ng');
    route && navigate(route);
  };

  const onSearch = (searchString: string, page?: number) => {
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
      dispatch(setPageLoading(true));
      const response = await PostService.loadCategoryBySlug(slug);
      response?.data?.[0]?.id &&
        loadCategoryPosts(response?.data?.[0]?.id, usedPage);
    } catch (error) {
      console.error(error);
      dispatch(setPageLoading(false));
    } finally {
    }
  }
  async function loadCategoryPosts(categoryId: string, page?: number) {
    try {
      const usedPage = page ? page : 1;
      dispatch(setPageLoading(true));
      const response = await PostService.loadCategoryPosts(categoryId, page);
      dispatch(setPosts(response.data));
      dispatch(
        dispatchLoadResult({
          currentPageType: PageType.CATEGORY,
          categoryId: categoryId,
          currentPageNumber: usedPage
        })
      );
      setTotals(response);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setPageLoading(false));
    }
  }

  async function loadSearchPosts(searchString: string, page?: number) {
    try {
      const usedPage = page ? page : 1;
      dispatch(setPageLoading(true));
      const response = await PostService.loadSearchPosts(searchString, page);
      dispatch(setPosts(response.data));
      dispatch(
        dispatchLoadResult({
          currentPageType: PageType.SEARCH,
          searchString: searchString,
          currentPageNumber: usedPage
        })
      );
      setTotals(response);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setPageLoading(false));
    }
  }

  async function loadMenus() {
    try {
      const response = await axios.get(
        'https://www.erime.eu/wp-json/menus/v1/menus/menu_en'
      );
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
      dispatch(setPageLoading(true));
      const response = await PostService.loadPost(slug);
      dispatch(
        setActivePost(response.data.length > 0 ? response.data[0] : undefined)
      );
      dispatch(
        dispatchLoadResult({
          currentPageType: PageType.POST,
          currentPageNumber: 1
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setPageLoading(false));
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
              <PostList onClickItem={onPostClick} loadData={onPostListLoad} />
            }
          />
          <Route
            path='/ng'
            element={
              <PostList onClickItem={onPostClick} loadData={onPostListLoad} />
            }
          />
          <Route
            path='/ng/language/:lang/:mainCategory/:slug/*'
            element={<MyPost loadData={onPostLoad} />}
          />
          <Route
            path='/ng/language/:lang/category/recipes/diet/:category/*'
            element={
              <PostList onClickItem={onPostClick} loadData={onPostListLoad} />
            }
          />
          <Route
            path='/ng/language/:lang/page/:pageNum'
            element={
              <PostList onClickItem={onPostClick} loadData={onPostListLoad} />
            }
          />
          <Route
            path='/ng/language/:lang/*'
            element={
              <PostList onClickItem={onPostClick} loadData={onPostListLoad} />
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
