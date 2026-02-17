import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!products?.length) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [products]);

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <section className='mb-10'>
      <div className='relative h-52 overflow-hidden rounded-3xl shadow-soft sm:h-80 lg:h-96'>
        {products.map((product, idx) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className={`${idx === active ? 'opacity-100' : 'pointer-events-none opacity-0'} absolute inset-0 transition-opacity duration-700`}
          >
            <img
              src={product.image}
              alt={product.name}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6'>
              <p className='app-subheading !text-slate-200'>Featured Product</p>
              <h2 className='mt-2 max-h-16 max-w-2xl overflow-hidden text-lg font-semibold text-white sm:text-2xl'>
                {product.name} <span className='text-coral'>${product.price}</span>
              </h2>
            </div>
          </Link>
        ))}

        <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
          {products.map((product, idx) => (
            <button
              key={product._id}
              type='button'
              onClick={() => setActive(idx)}
              className={`h-2.5 w-8 rounded-full ${idx === active ? 'bg-brand-500' : 'bg-white/50'}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
