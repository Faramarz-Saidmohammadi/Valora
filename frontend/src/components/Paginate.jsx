import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className='mt-8 flex flex-wrap justify-center gap-2 sm:justify-start'>
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
              x + 1 === page
                ? 'bg-brand-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    )
  );
};

export default Paginate;
