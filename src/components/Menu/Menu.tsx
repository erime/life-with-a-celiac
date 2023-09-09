import s from "./Menu.module.css"
import { IMenuItem } from "../../App"
import { useState } from "react";

interface IMyProps {
    menuItems: Array<IMenuItem>;
    onClickItem: any;
}

export function Menu(props: IMyProps) {

const [menuVisible, setMenuVisible] = useState<number>();

    const onClick = (url: string, menuType: string, objectId: string) => {
        props.onClickItem(url, menuType, objectId);
    }

    const mouseEnter = (id: number) => {
        setMenuVisible(id);
    }

    const mouseLeave = () => {
        setMenuVisible(undefined);
    }

    return <div className={s.menu_container}>
        {props.menuItems.map((menuItem) => {
            return <div className={s.menu_item} onMouseEnter={() => mouseEnter(menuItem.ID)} onMouseLeave={() => mouseLeave()}>
                <div className={s.menu_item_title}>{menuItem.title}</div>
                { menuVisible === menuItem.ID && <ul>
                    {menuItem.child_items.map((subMenuItem) => {
                        return <li value={subMenuItem.url} onClick={() => onClick(subMenuItem.url, subMenuItem.object, subMenuItem.object_id)}>{subMenuItem.title}</li>
                    })}
                </ul>}
            </div>
        })}
    </div>
}

