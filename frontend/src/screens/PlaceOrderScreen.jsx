import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <section className='grid gap-6 lg:grid-cols-12'>
        <div className='space-y-6 lg:col-span-8'>
          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Shipping</h2>
            <p className='text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Address:</span> {cart.shippingAddress.address},{' '}
              {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Payment Method</h2>
            <p className='text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Method:</span> {cart.paymentMethod}
            </p>
          </div>

          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className='space-y-3'>
                {cart.cartItems.map((item, index) => (
                  <div key={index} className='grid grid-cols-[64px,1fr] items-center gap-4 rounded-xl border border-slate-200 p-3 sm:grid-cols-[64px,1fr,auto]'>
                    <img src={item.image} alt={item.name} className='h-16 w-16 rounded-lg object-cover' />
                    <Link to={`/product/${item.product}`} className='min-w-0 truncate font-medium text-ink'>
                      {item.name}
                    </Link>
                    <p className='col-span-2 text-right text-xs font-semibold text-ink sm:col-span-1 sm:text-sm'>
                      {item.qty} x ${item.price} = ${(item.qty * (item.price * 100)) / 100}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <aside className='lg:col-span-4'>
          <div className='app-card space-y-4 lg:sticky lg:top-24'>
            <p className='app-subheading'>Final Step</p>
            <h2 className='text-xl font-semibold tracking-[-0.01em] text-ink'>Order Summary</h2>
            <div className='space-y-2 text-sm text-slate-600'>
              <p className='flex justify-between'>
                <span>Items</span>
                <span className='font-semibold text-ink'>${cart.itemsPrice}</span>
              </p>
              <p className='flex justify-between'>
                <span>Shipping</span>
                <span className='font-semibold text-ink'>${cart.shippingPrice}</span>
              </p>
              <p className='flex justify-between'>
                <span>Tax</span>
                <span className='font-semibold text-ink'>${cart.taxPrice}</span>
              </p>
              <p className='flex justify-between text-base'>
                <span>Total</span>
                <span className='font-bold text-ink'>${cart.totalPrice}</span>
              </p>
            </div>
            {error && <Message variant='danger'>{error.data.message}</Message>}
            <button
              type='button'
              className='app-btn w-full'
              disabled={cart.cartItems === 0}
              onClick={placeOrderHandler}
            >
              Place Order Securely
            </button>
            <p className='text-center text-xs text-slate-500'>By placing this order, you agree to our store terms.</p>
            {isLoading && <Loader />}
          </div>
        </aside>
      </section>
    </>
  );
};

export default PlaceOrderScreen;
