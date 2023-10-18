import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Post } from '../../App';
import { useAppSelector } from '../../store/hooks';
import { PostListItem } from '../PostListItem/PostListItem';

interface MyProps {
  onClickItem: (url: string, slug: string) => void;
  loadData: (
    lang: string | undefined,
    category: string | undefined,
    searchString: string | null,
    pageNum: string | undefined
  ) => void;
}

export function PostList(props: MyProps) {
  const { lang, category, pageNum } = useParams();
  const posts = useAppSelector((state) => state.posts.posts);
  const pageLoading = useAppSelector((state) => state.global.pageLoading);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // access query parameters
  const searchString = queryParams.get('s');

  const onClickItem = (url: string, slug: string) => {
    props.onClickItem(url, slug);
  };

  useEffect(() => {
    props.loadData(lang, category, searchString, pageNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, category, pageNum, searchString]);

  return (
    <>
      {posts &&
        posts.map((post: Post, index: number) => {
          return (
            <PostListItem
              key={`postItem_${post.id}_${index}`}
              post={post}
              align={index % 2}
              loading={pageLoading}
              onClick={onClickItem}
            />
          );
        })}
    </>
  );
}
