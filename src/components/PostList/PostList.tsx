import { IPost } from '../../App';
import { PostListItem } from '../PostListItem/PostListItem';

interface IMyProps {
  posts: Array<IPost>;
  onClickItem: any;
}

export function PostList(props: IMyProps) {
  const onClickItem = (id: number) => {
    props.onClickItem(id);
  };

  return (
    <div>
      {props.posts &&
        props.posts.map((post: IPost, index: number) => {
          return (
            <PostListItem
              key={`postItem_${post.id}`}
              post={post}
              align={index % 2}
              onClick={onClickItem}
            />
          );
        })}
    </div>
  );
}
