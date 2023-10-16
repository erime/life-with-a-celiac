import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IPost } from '../../App';
import s from './Post.module.scss';
import './Post.scss';

interface IMyProps {
  post: IPost | undefined;
  loading: boolean;
  loadData: (slug: string) => void;
}

export const DUMMY_POST: IPost = {
  id: 0,
  date: '',
  title: {
    rendered: ''
  },
  link: '',
  content: {
    rendered: ''
  },
  slug: '',
  _embedded: {
    'wp:featuredmedia': [
      {
        media_details: {
          sizes: {
            medium: {
              source_url: ''
            },
            medium_large: {
              source_url: ''
            },
            large: {
              source_url: ''
            },
            full: {
              source_url: ''
            },
            '1536x1536': {
              source_url: ''
            }
          }
        }
      }
    ]
  },
  _links: {
    self: [
      {
        href: ''
      }
    ]
  },
  excerpt: {
    rendered: ''
  }
};

export function Post(props: IMyProps) {
  const { lang, mainCategory, slug } = useParams();
  console.log('====lang', lang, mainCategory, slug);

  useEffect(() => {
    slug && props.loadData(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, mainCategory, slug]);

  const featureImageUrl =
    props.post?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes[
      '1536x1536'
    ]?.source_url ||
    props.post?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.full
      ?.source_url;

  const postLoading = (
    <div className={`${s.container} ${s.loader_container}`}>
      <div className={s.featured_image}>
        <div className={s.loader_image}>&nbsp;</div>
      </div>
      <h1 className={s.title}>
        <div className={s.loader_title}>&nbsp;</div>
      </h1>
      <div className={s.wp_content}>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
      </div>
    </div>
  );
  const PostLoaded = (
    <div className={s.container}>
      {featureImageUrl && (
        <img
          className={s.featured_image}
          src={featureImageUrl}
          alt={props.post?.title.rendered}
        />
      )}
      <h1 className={s.title}>{props.post && props.post.title.rendered}</h1>
      <div className={s.wp_content}>
        {props.post && (
          <div
            className='wp'
            dangerouslySetInnerHTML={{
              __html: props.post.content.rendered
            }}
          ></div>
        )}
      </div>
    </div>
  );
  return props.loading ? postLoading : PostLoaded;
}
