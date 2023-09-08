import s from "./Post.module.css";
import { IPost } from "../../App";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IMyProps {
    //post: IPost;
}

export function Post(props: IMyProps) {

    const [activePost, setActivePost] = useState<IPost>();

    const navigate = useNavigate();
    const slug = window.location.href.split('/').filter((elem) => elem?.length > 0).pop();
    console.log('====slug', slug)

    useEffect(() => {
        slug && getPost(slug);
      }, [])

    async function getPost(slug: string) {
        try {
          const response = await axios.get(`https://www.erime.eu/wp-json/wp/v2/posts?_embed&slug=${slug}`);
          console.log(response);
          setActivePost(response.data.length > 0 ? response.data[0] : undefined);
        } catch (error) {
          console.error(error);
        }
      }

    return <div className={s.container}>
        { activePost && <img className={s.featured_image} src={activePost._embedded["wp:featuredmedia"][0].media_details.sizes["1536x1536"].source_url} /> }
        <h1 className={s.title}>{activePost && activePost.title.rendered}</h1>
        <div className={s.wp_content}>
            { activePost && <div dangerouslySetInnerHTML={{__html: activePost.content.rendered}}></div> }
        </div>
    </div>
}