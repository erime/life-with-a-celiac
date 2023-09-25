import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { IPost } from '../../App';
import { PostListItem } from '../PostListItem/PostListItem';

interface IMyProps {
  posts: Array<IPost>;
  onClickItem: (url: string, slug: string) => void;
  loading: boolean;
  loadData: (
    lang: string | undefined,
    category: string | undefined,
    searchString: string | null,
    pageNum: string | undefined
  ) => void;
}

export function PostList(props: IMyProps) {
  const { lang, category, pageNum } = useParams();
  console.log('====PostList', lang, category, pageNum);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // access query parameters
  const searchString = queryParams.get('s');
  console.log('====searchString', searchString);

  const onClickItem = (url: string, slug: string) => {
    props.onClickItem(url, slug);
  };

  console.log('====posts', props.posts);

  useEffect(() => {
    props.loadData(lang, category, searchString, pageNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, category, pageNum, searchString]);

  return (
    <>
      {props.posts &&
        props.posts.map((post: IPost, index: number) => {
          return (
            <PostListItem
              key={`postItem_${post.id}_${index}`}
              post={post}
              align={index % 2}
              loading={props.loading}
              onClick={onClickItem}
            />
          );
        })}
    </>
  );
}
