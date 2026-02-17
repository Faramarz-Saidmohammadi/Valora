import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <article className='group app-card h-full overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)]'>
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className='h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]'
        />
      </Link>

      <div className='space-y-3 p-4 sm:p-5'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <span className='trust-chip'>Verified Seller</span>
          <p className='text-lg font-semibold tracking-[-0.01em] text-ink sm:text-xl'>${product.price}</p>
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className='product-title'>{product.name}</h3>
        </Link>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <Link to={`/product/${product._id}`} className='app-btn mt-1 w-full'>
          View Product
        </Link>
      </div>
    </article>
  );
};

export default Product;
