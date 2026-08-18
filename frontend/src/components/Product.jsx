import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  const inStock = product.countInStock > 0;

  return (
    <article className='group app-card flex h-full flex-col overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)]'>
      <Link to={`/product/${product._id}`} className='block overflow-hidden bg-slate-100'>
        <img
          src={product.image}
          alt={product.name}
          loading='lazy'
          className='h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]'
        />
      </Link>

      <div className='flex flex-1 flex-col gap-3 p-4 sm:p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
              {product.category}
            </p>
            <Link to={`/product/${product._id}`}>
              <h3 className='product-title mt-1'>{product.name}</h3>
            </Link>
            <p className='mt-1 text-xs text-slate-500'>{product.brand}</p>
          </div>
          <p className='shrink-0 text-lg font-semibold tracking-[-0.01em] text-ink sm:text-xl'>
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

        <div className='mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3'>
          <span className={`text-xs font-semibold ${inStock ? 'text-emerald-700' : 'text-red-600'}`}>
            {inStock ? `${product.countInStock} in stock` : 'Out of stock'}
          </span>
          <Link to={`/product/${product._id}`} className='app-btn px-3 py-2'>
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Product;
