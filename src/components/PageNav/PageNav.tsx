import s from './PageNav.module.css';

interface IMyProps {
  pageClicked: any;
  totalPages: number;
  currentPage: number;
  totalPostCount: number;
}

export function PageNav(props: IMyProps) {
  return (
    <>
      {Array.apply(0, Array(props.totalPages)).map(function (x, i) {
        return (
          <button
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
