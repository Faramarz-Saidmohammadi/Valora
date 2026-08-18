import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  const categoryOptions = useMemo(() => {
    if (!data?.products) return [];
    return [...new Set(data.products.map((product) => product.category).filter(Boolean))].sort();
  }, [data]);

  const visibleProducts = useMemo(() => {
    if (!data?.products) return [];

    const items =
      categoryFilter === 'all'
        ? [...data.products]
        : data.products.filter((product) => product.category === categoryFilter);

    if (sortBy === 'priceAsc') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);

    return items;
  }, [categoryFilter, data, sortBy]);

  const inStockCount = visibleProducts.filter((product) => product.countInStock > 0).length;

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='app-btn-secondary mb-6'>
          Clear search
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta />
          <section className='mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end'>
            <div>
              <p className='app-subheading'>{keyword ? 'Search results' : 'Shop collection'}</p>
              <h1 className='app-heading mt-2'>
                {keyword ? `Results for “${keyword}”` : 'Latest products'}
              </h1>
              <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500'>
                Browse the current catalog, compare prices and ratings, and filter products by category.
              </p>
            </div>
            <div className='flex flex-wrap gap-2 text-xs font-semibold text-slate-600'>
              <span className='rounded-full bg-slate-100 px-3 py-1.5'>{visibleProducts.length} shown</span>
              <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700'>{inStockCount} in stock</span>
            </div>
          </section>

          <div className='glass-panel mb-6 rounded-2xl p-3 sm:p-4'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex flex-wrap gap-2' role='group' aria-label='Filter products by category'>
                <button
                  type='button'
                  onClick={() => setCategoryFilter('all')}
                  aria-pressed={categoryFilter === 'all'}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'}`}
                >
                  All
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type='button'
                    onClick={() => setCategoryFilter(category)}
                    aria-pressed={categoryFilter === category}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === category ? 'bg-brand-600 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className='flex w-full items-center gap-2 sm:w-auto'>
                <label htmlFor='sort' className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                  Sort
                </label>
                <select
                  id='sort'
                  className='w-full rounded-xl border border-white/70 bg-white/85 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-auto'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value='featured'>Featured</option>
                  <option value='rating'>Top rated</option>
                  <option value='priceAsc'>Price: low to high</option>
                  <option value='priceDesc'>Price: high to low</option>
                </select>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4'>
            {visibleProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <div className='mt-6'>
              <Message>No products matched the selected filter.</Message>
            </div>
          )}

          <Paginate pages={data.pages} page={data.page} keyword={keyword || ''} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
