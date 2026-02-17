import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const categoryOptions = useMemo(() => {
    if (!data?.products) return [];
    return [...new Set(data.products.map((product) => product.category).filter(Boolean))];
  }, [data]);

  const visibleProducts = useMemo(() => {
    if (!data?.products) return [];

    let items =
      categoryFilter === 'all'
        ? [...data.products]
        : data.products.filter((product) => product.category === categoryFilter);

    if (sortBy === 'priceAsc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [categoryFilter, data, sortBy]);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='app-btn-secondary mb-6'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta />
          <div className='mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8'>
            <div>
              <p className='app-subheading'>Shop Collection</p>
              <h1 className='app-heading mt-2'>Latest Products</h1>
              <p className='mt-2 max-w-2xl text-sm text-slate-500'>
                Discover trusted picks with fast delivery and secure checkout.
              </p>
            </div>
          </div>
          <div className='glass-panel mb-6 rounded-2xl p-3 sm:p-4'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={() => setCategoryFilter('all')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${categoryFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'}`}
                >
                  All
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type='button'
                    onClick={() => setCategoryFilter(category)}
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
                  className='w-full rounded-xl border border-white/70 bg-white/85 px-3 py-2 text-sm text-slate-700 outline-none sm:w-auto'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value='featured'>Featured</option>
                  <option value='rating'>Top Rated</option>
                  <option value='priceAsc'>Price: Low to High</option>
                  <option value='priceDesc'>Price: High to Low</option>
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
              <Message>No products matched this filter.</Message>
            </div>
          )}
          <Paginate pages={data.pages} page={data.page} keyword={keyword || ''} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
