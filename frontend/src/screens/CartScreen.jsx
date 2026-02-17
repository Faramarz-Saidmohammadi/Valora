import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <section className='grid gap-6 lg:grid-cols-12'>
      <div className='lg:col-span-8'>
        <p className='app-subheading'>Bag</p>
        <h1 className='app-heading mb-5 mt-2'>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <div className='space-y-3'>
            {cartItems.map((item) => (
              <article
                key={item._id}
                className='app-card grid grid-cols-1 items-center gap-4 sm:grid-cols-[80px,1fr] lg:grid-cols-[80px,1fr,120px,120px,56px]'
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-20 w-20 rounded-xl object-cover'
                />
                <Link to={`/product/${item._id}`} className='min-w-0 break-words font-semibold text-ink'>
                  {item.name}
                </Link>
                <div className='flex flex-wrap items-center justify-between gap-3 lg:contents'>
                  <p className='text-sm font-semibold text-ink'>${item.price}</p>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className='app-input w-24'
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type='button'
                    className='app-btn-danger'
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <aside className='lg:col-span-4'>
        <div className='app-card space-y-4 lg:sticky lg:top-24'>
          <h2 className='text-xl font-bold text-ink'>
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
          </h2>
          <p className='text-2xl font-bold text-ink'>
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </p>
          <button
            type='button'
            className='app-btn w-full'
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </button>
          <p className='text-center text-xs text-slate-500'>Shipping and taxes calculated at checkout.</p>
        </div>
      </aside>
    </section>
  );
};

export default CartScreen;
