import s from './Search.module.scss';

interface Props {
  onSearch: any;
}

export function Search(props: Props) {
  const searchSubmit = (e: any) => {
    e.key === 'Enter' && props.onSearch(e.target.value);
  };

  return (
    <div className={s.search_container}>
      <span className={s.magnify_icon}>🔍</span>
      <input
        className={s.search_box}
        onKeyUp={searchSubmit}
        aria-label='Search'
      ></input>
    </div>
  );
}
