import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IPost } from '../../App';
import { PageLoader } from '../PageLoader/PageLoader';
import s from './Post.module.scss';

interface IMyProps {
  post: IPost | undefined;
  loading: boolean;
}

export function Post(props: IMyProps) {
  const { lang, mainCategory, slug } = useParams();
  console.log('====lang', lang, mainCategory, slug);

  useEffect(() => {}, [props]);

  const featureImageUrl =
    props.post?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes[
      '1536x1536'
    ]?.source_url ||
    props.post?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.full
      ?.source_url;
  return (
    <>
      {props.loading && <PageLoader />}
      {!props.loading && (
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
      )}
    </>
  );
}
