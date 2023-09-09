import { useState } from 'react';
import { IMenuItem } from '../../App';
import s from './Menu.module.css';

interface IMyProps {
  menuItems: Array<IMenuItem>;
  onClickItem: any;
}

export function Menu(props: IMyProps) {
  const [menuVisible, setMenuVisible] = useState<number>();

  const onClick = (url: string, menuType: string, objectId: string) => {
    props.onClickItem(url, menuType, objectId);
  };

  const mouseEnter = (id: number) => {
    setMenuVisible(id);
  };

  const mouseLeave = () => {
    setMenuVisible(undefined);
  };

  return (
    <div className={s.menu_container}>
      {props.menuItems.map((menuItem, index) => {
        return (
          <div
            key={`menuItem_${menuItem.object_id}`}
            className={s.menu_item}
            onMouseEnter={() => mouseEnter(menuItem.ID)}
            onMouseLeave={() => mouseLeave()}
          >
            <button className={s.menu_item_title}>{menuItem.title}</button>
            {menuVisible === menuItem.ID && (
              <ul>
                {menuItem.child_items.map((subMenuItem) => {
                  return (
                    <li
                      key={`subMenuItem_${subMenuItem.object_id}`}
                      value={subMenuItem.url}
                      onClick={() =>
                        onClick(
                          subMenuItem.url,
                          subMenuItem.object,
                          subMenuItem.object_id
                        )
                      }
                    >
                      {subMenuItem.title}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
