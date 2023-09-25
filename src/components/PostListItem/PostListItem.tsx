import { decode } from 'html-entities';
import { IPost } from '../../App';
import s from './PostListItem.module.scss';

interface IMyProps {
  post: IPost;
  align: number;
  loading: boolean;
  onClick: (url: string, slug: string) => void;
}

export function PostListItem(props: IMyProps) {
  const date = new Date(props.post.date).toDateString();
  const blurb = decode(
    props.post.excerpt.rendered.split('</p>')[0].replace('<p>', '')
  );

  const onClick = () => {
    props.onClick(props.post.link, props.post.slug);
  };
  const featureImageUrl =
    props.post._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes
      ?.medium_large?.source_url ||
    props.post._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.large
      ?.source_url;

  const loadingPost = (
    <div
      className={`${s.container} row ${
        props.align === 0 ? s.direction_reverse : ''
      }`}
    >
      <div className={`${s.image_container} col-md-6`}>
        <div className={s.loader_image}>&nbsp;</div>
      </div>
      <div className={`${s.description} col-md-6`}>
        <div className={s.date}>
          <div className={s.loader_date}>&nbsp;</div>
        </div>
        <h1 className={s.title}>
          <div className={s.loader_title}>&nbsp;</div>
        </h1>
        <div className={s.blurb}>
          <div className={s.loader_blurb}>&nbsp;</div>
        </div>
      </div>
    </div>
  );
  const loadedPost = (
    <div
      className={`${s.container} row ${
        props.align === 0 ? s.direction_reverse : ''
      }`}
      onClick={onClick}
    >
      <div className={`${s.image_container} col-md-6`}>
        {featureImageUrl && <img src={featureImageUrl} alt=''></img>}
      </div>
      <div className={`${s.description} col-md-6`}>
        <div className={s.date}>{date}</div>
        <h1 className={s.title}>{props.post.title.rendered}</h1>
        <div>{blurb}</div>
      </div>
    </div>
  );
  return props.loading ? loadingPost : loadedPost;
}
