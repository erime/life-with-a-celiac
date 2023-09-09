import React from "react";
import s from "./PostListItem.module.css"
import { IPost } from "../../App";
import { decode } from "html-entities";

interface IMyProps {
    post: IPost;
    align: number;
    onClick: any;
}

export function PostListItem(props: IMyProps) {
    const date = (new Date(props.post.date)).toDateString();
    const blurb = decode(props.post.excerpt.rendered.split('</p>')[0].replace('<p>', ''));

    const onClick = () => {
        props.onClick(props.post.id);
    }
    const featureImageUrl = props.post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url ||
    props.post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url;
    return <div className={`${s.container} row ${props.align === 0 ? s.direction_reverse : ''}`} onClick={onClick}>
        <div className={`${s.image_container} col-md-6`}>
        {featureImageUrl && <img src={featureImageUrl}></img>}
        </div>
        <div className={`${s.description} col-md-6`}>
            <div>{date}</div>
            <h1 className={s.title}>{props.post.title.rendered}</h1>
            <div>{blurb}</div>
            <div><a href={props.post.link}>Read the post</a></div>
        </div>
    </div>
}