import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../App';
import { useAppSelector } from '../../store/hooks';
import s from './Post.module.scss';
import './Post.scss';

interface Props {
  loadData: (slug: string) => void;
}

export const DUMMY_POST: Post = {
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

export function MyPost(props: Props) {
  const { lang, mainCategory, slug } = useParams();

  const activePost = useAppSelector((state) => state.posts.activePost);
  const pageLoading = useAppSelector((state) => state.global.pageLoading);

  useEffect(() => {
    slug && props.loadData(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, mainCategory, slug]);

  const featureImageUrl =
    activePost?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes[
      '1536x1536'
    ]?.source_url ||
    activePost?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.full
      ?.source_url;

  const postLoading = (
    <article className={`${s.container} ${s.loader_container}`}>
      <div className={s.featured_image}>
        <div className={s.loader_image}>&nbsp;</div>
      </div>
      <h1 className={s.title}>
        <div className={s.loader_title}>&nbsp;</div>
      </h1>
      <section className={s.wp_content}>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
        <div className={s.loader_content}>&nbsp;</div>
      </section>
    </article>
  );
  const PostLoaded = (
    <article className={s.container}>
      {featureImageUrl && (
        <img
          className={s.featured_image}
          src={featureImageUrl}
          alt={activePost?.title.rendered}
        />
      )}
      <h1 className={s.title}>{activePost && activePost.title.rendered}</h1>
      <section className={s.wp_content}>
        {activePost && (
          <div
            className='wp'
            dangerouslySetInnerHTML={{
              __html: activePost.content.rendered
            }}
          ></div>
        )}
      </section>
    </article>
  );
  return pageLoading ? postLoading : PostLoaded;
}
