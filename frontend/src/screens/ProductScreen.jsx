import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className='app-btn-secondary mb-6' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <section className='grid gap-6 lg:grid-cols-12'>
            <div className='app-card lg:col-span-6'>
              <img
                src={product.image}
                alt={product.name}
                className='max-h-[28rem] w-full rounded-xl object-cover'
              />
            </div>
            <div className='app-card space-y-4 lg:col-span-3'>
              <p className='app-subheading'>Product Details</p>
              <h1 className='text-2xl font-semibold tracking-[-0.02em] text-ink'>{product.name}</h1>
              <div className='flex flex-wrap gap-2'>
                <span className='trust-chip'>Free Returns</span>
                <span className='trust-chip'>Secure Checkout</span>
              </div>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              <p className='text-2xl font-semibold tracking-[-0.01em] text-ink'>${product.price}</p>
              <p className='text-sm leading-7 text-slate-600'>{product.description}</p>
            </div>
            <div className='app-card lg:col-span-3'>
              <div className='space-y-4 text-sm'>
                <p className='app-subheading'>Purchase</p>
                <div className='flex items-center justify-between'>
                  <span className='text-slate-500'>Price</span>
                  <span className='font-semibold text-ink'>${product.price}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-slate-500'>Status</span>
                  <span
                    className={`font-semibold ${product.countInStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </span>
                </div>
                {product.countInStock > 0 && (
                  <div>
                    <label className='mb-1 block text-slate-500'>Qty</label>
                    <select
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
                  Add To Cart
                </button>
                <p className='text-xs text-slate-500'>Encrypted payment and buyer protection included.</p>
              </div>
            </div>
          </section>

          <section className='mt-10 grid gap-6 lg:grid-cols-2'>
            <div className='app-card space-y-4'>
              <h2 className='text-xl font-semibold tracking-[-0.01em] text-ink'>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              {product.reviews.map((review) => (
                <div key={review._id} className='rounded-xl border border-slate-200 p-4'>
                  <p className='font-semibold text-ink'>{review.name}</p>
                  <Rating value={review.rating} />
                  <p className='mt-2 text-xs text-slate-500'>{review.createdAt.substring(0, 10)}</p>
                  <p className='mt-2 text-sm text-slate-600'>{review.comment}</p>
                </div>
              ))}
            </div>

            <div className='app-card'>
              <h2 className='mb-4 text-xl font-semibold tracking-[-0.01em] text-ink'>Write a Customer Review</h2>
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
                      <option value=''>Select...</option>
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
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className='app-input min-h-32'
                    ></textarea>
                  </div>
                  <button disabled={loadingProductReview} type='submit' className='app-btn'>
                    Submit
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to='/login'>sign in</Link> to write a review
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
