import s from './PageNav.module.scss';

interface Props {
  pageClicked: any;
  totalPages: number;
  currentPage: number;
  totalPostCount: number;
}

export function PageNav(props: Props) {
  return (
    <>
      {Array.apply(0, Array(props.totalPages)).map(function (x, i) {
        return (
          <button
            key={`nav_button_${i}`}
            id={`nav_button_${i}`}
            className={s.nav_button}
            disabled={props.currentPage === i + 1}
            onClick={() => {
              props.pageClicked(i + 1);
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </>
  );
}
