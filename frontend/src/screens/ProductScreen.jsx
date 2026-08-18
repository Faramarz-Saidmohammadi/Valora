import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    if (!product || product.countInStock < 1) return;
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ productId, rating: Number(rating), comment }).unwrap();
      refetch();
      toast.success('Review created successfully');
      setRating('');
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className='app-btn-secondary mb-6' to='/'>
        Back to products
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <section className='grid gap-6 lg:grid-cols-12'>
            <div className='app-card overflow-hidden p-0 lg:col-span-6'>
              <img
                src={product.image}
                alt={product.name}
                className='h-full max-h-[34rem] min-h-[24rem] w-full object-cover'
              />
            </div>

            <div className='app-card space-y-5 lg:col-span-3'>
              <div>
                <p className='app-subheading'>{product.category}</p>
                <h1 className='mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink'>
                  {product.name}
                </h1>
                <p className='mt-1 text-sm text-slate-500'>by {product.brand}</p>
              </div>

              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              <p className='text-3xl font-semibold tracking-[-0.02em] text-ink'>
                ${Number(product.price).toFixed(2)}
              </p>
              <p className='text-sm leading-7 text-slate-600'>{product.description}</p>
            </div>

            <aside className='app-card lg:col-span-3' aria-label='Purchase options'>
              <div className='space-y-4 text-sm'>
                <p className='app-subheading'>Purchase</p>
                <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                  <span className='text-slate-500'>Price</span>
                  <span className='font-semibold text-ink'>${Number(product.price).toFixed(2)}</span>
                </div>
                <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                  <span className='text-slate-500'>Availability</span>
                  <span className={`font-semibold ${product.countInStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {product.countInStock > 0 && (
                  <div>
                    <label htmlFor='quantity' className='mb-1 block text-slate-500'>
                      Quantity
                    </label>
                    <select
                      id='quantity'
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className='app-input'
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className='app-btn w-full'
                  type='button'
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  {product.countInStock > 0 ? 'Add to cart' : 'Currently unavailable'}
                </button>
              </div>
            </aside>
          </section>

          <section className='mt-10 grid gap-6 lg:grid-cols-2'>
            <div className='app-card space-y-4'>
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl font-semibold tracking-[-0.01em] text-ink'>Customer reviews</h2>
                <span className='text-sm text-slate-500'>{product.numReviews} total</span>
              </div>
              {product.reviews.length === 0 && <Message>No reviews yet.</Message>}
              {product.reviews.map((review) => (
                <article key={review._id} className='rounded-xl border border-slate-200 p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <p className='font-semibold text-ink'>{review.name}</p>
                    <p className='text-xs text-slate-500'>{review.createdAt.substring(0, 10)}</p>
                  </div>
                  <Rating value={review.rating} />
                  <p className='mt-2 text-sm leading-6 text-slate-600'>{review.comment}</p>
                </article>
              ))}
            </div>

            <div className='app-card'>
              <h2 className='mb-4 text-xl font-semibold tracking-[-0.01em] text-ink'>Write a review</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                <form onSubmit={submitHandler} className='space-y-4'>
                  <div>
                    <label htmlFor='rating' className='mb-1 block text-sm font-medium text-slate-700'>
                      Rating
                    </label>
                    <select
                      id='rating'
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className='app-input'
                    >
                      <option value=''>Select a rating</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor='comment' className='mb-1 block text-sm font-medium text-slate-700'>
                      Comment
                    </label>
                    <textarea
                      id='comment'
                      required
                      maxLength={1000}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className='app-input min-h-32'
                    />
                    <p className='mt-1 text-right text-xs text-slate-400'>{comment.length}/1000</p>
                  </div>
                  <button disabled={loadingProductReview} type='submit' className='app-btn'>
                    Submit review
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to='/login'>sign in</Link> to write a review.
                </Message>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ProductScreen;
