import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import s from './Menu.module.scss';

interface Props {
  onClickItem: any;
}

export function Menu(props: Props) {
  const menuItems = useAppSelector((state) => state.global.menu);
  const [menuVisible, setMenuVisible] = useState<number>();

  const onClick = (
    url: string,
    menuType: string,
    objectId: string,
    slug: string
  ) => {
    props.onClickItem(url, menuType, objectId, slug);
  };

  const mouseEnter = (id: number) => {
    setMenuVisible(id);
  };

  const mouseLeave = () => {
    setMenuVisible(undefined);
  };

  return (
    <div className={s.menu_container}>
      {menuItems.map((menuItem, index) => {
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
                          subMenuItem.object_id,
                          subMenuItem.slug
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
