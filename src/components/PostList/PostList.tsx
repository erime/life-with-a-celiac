import { useLocation, useParams } from 'react-router-dom';
import { IPost } from '../../App';
import { PostListItem } from '../PostListItem/PostListItem';

interface IMyProps {
  posts: Array<IPost>;
  onClickItem: any;
  loading: boolean;
}

export function PostList(props: IMyProps) {
  const { lang, category } = useParams();
  console.log('====lang', lang, category);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // access query parameters
  const searchString = queryParams.get('s');
  console.log('====searchString', searchString);

  const onClickItem = (url: string, slug: string) => {
    props.onClickItem(url, slug);
  };

  console.log('====posts', props.posts);

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
