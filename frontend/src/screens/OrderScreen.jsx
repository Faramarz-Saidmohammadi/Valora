import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <p className='app-subheading'>Order Confirmation</p>
      <h1 className='app-heading mb-6 mt-2 break-all'>Order {order._id}</h1>
      <section className='grid gap-6 lg:grid-cols-12'>
        <div className='space-y-6 lg:col-span-8'>
          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Shipping</h2>
            <p className='text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Name:</span> {order.user.name}
            </p>
            <p className='text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Email:</span>{' '}
                <a className='break-all' href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p className='mb-3 text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Address:</span> {order.shippingAddress.address},{' '}
              {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant='success'>Delivered on {order.deliveredAt}</Message>
            ) : (
              <Message variant='danger'>Not Delivered</Message>
            )}
          </div>

          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Payment Method</h2>
            <p className='mb-3 text-sm text-slate-600'>
              <span className='font-semibold text-ink'>Method:</span> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant='success'>Paid on {order.paidAt}</Message>
            ) : (
              <Message variant='danger'>Not Paid</Message>
            )}
          </div>

          <div className='app-card'>
            <h2 className='mb-3 text-xl font-semibold tracking-[-0.01em] text-ink'>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className='space-y-3'>
                {order.orderItems.map((item, index) => (
                  <div key={index} className='grid grid-cols-[64px,1fr] items-center gap-4 rounded-xl border border-slate-200 p-3 sm:grid-cols-[64px,1fr,auto]'>
                    <img src={item.image} alt={item.name} className='h-16 w-16 rounded-lg object-cover' />
                    <Link to={`/product/${item.product}`} className='min-w-0 truncate font-medium text-ink'>
                      {item.name}
                    </Link>
                    <p className='col-span-2 text-right text-xs font-semibold text-ink sm:col-span-1 sm:text-sm'>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <aside className='lg:col-span-4'>
          <div className='app-card space-y-4 lg:sticky lg:top-24'>
            <h2 className='text-xl font-semibold tracking-[-0.01em] text-ink'>Order Summary</h2>
            <div className='space-y-2 text-sm text-slate-600'>
              <p className='flex justify-between'>
                <span>Items</span>
                <span className='font-semibold text-ink'>${order.itemsPrice}</span>
              </p>
              <p className='flex justify-between'>
                <span>Shipping</span>
                <span className='font-semibold text-ink'>${order.shippingPrice}</span>
              </p>
              <p className='flex justify-between'>
                <span>Tax</span>
                <span className='font-semibold text-ink'>${order.taxPrice}</span>
              </p>
              <p className='flex justify-between text-base'>
                <span>Total</span>
                <span className='font-bold text-ink'>${order.totalPrice}</span>
              </p>
            </div>

            {!order.isPaid && (
              <div className='space-y-3'>
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button type='button' className='app-btn w-full' onClick={deliverHandler}>
                Mark As Delivered
              </button>
            )}
          </div>
        </aside>
      </section>
    </>
  );
};

export default OrderScreen;
