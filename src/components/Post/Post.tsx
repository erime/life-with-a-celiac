import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPost } from '../../App';
import s from './Post.module.css';

interface IMyProps {
  //post: IPost;
}

export function Post(props: IMyProps) {
  const [activePost, setActivePost] = useState<IPost>();

  useEffect(() => {
    const slug = window.location.href
    .split('/')
    .filter((elem) => elem?.length > 0)
    .pop();

    slug && getPost(slug);
  }, [props]);

  async function getPost(slug: string) {
    try {
      const response = await axios.get(
        `https://www.erime.eu/wp-json/wp/v2/posts?_embed&slug=${slug}`
      );
      console.log(response);
      setActivePost(response.data.length > 0 ? response.data[0] : undefined);
    } catch (error) {
      console.error(error);
    }
  }

  const featureImageUrl =
    activePost?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes[
      '1536x1536'
    ]?.source_url ||
    activePost?._embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.full
      ?.source_url;
  return (
    <div className={s.container}>
      {featureImageUrl && (
        <img className={s.featured_image} src={featureImageUrl} alt={activePost.title.rendered}/>
      )}
      <h1 className={s.title}>{activePost && activePost.title.rendered}</h1>
      <div className={s.wp_content}>
        {activePost && (
          <div
            className='wp'
            dangerouslySetInnerHTML={{ __html: activePost.content.rendered }}
          ></div>
        )}
      </div>
    </div>
  );
}
