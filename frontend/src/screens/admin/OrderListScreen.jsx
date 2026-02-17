import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <p className='app-subheading'>Admin</p>
      <h1 className='app-heading mb-6 mt-2'>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className='space-y-3 md:hidden'>
            {orders.map((order) => (
              <article key={order._id} className='app-card space-y-2'>
                <p className='break-all text-xs text-slate-500'>{order._id}</p>
                <p className='text-sm'><span className='font-semibold'>User:</span> {order.user && order.user.name}</p>
                <p className='text-sm'><span className='font-semibold'>Date:</span> {order.createdAt.substring(0, 10)}</p>
                <p className='text-sm'><span className='font-semibold'>Total:</span> ${order.totalPrice}</p>
                <p className='text-sm'><span className='font-semibold'>Paid:</span> {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</p>
                <p className='text-sm'><span className='font-semibold'>Delivered:</span> {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</p>
                <Link to={`/order/${order._id}`} className='app-btn-secondary !px-3 !py-1.5 text-xs'>
                  Details
                </Link>
              </article>
            ))}
          </div>
          <div className='app-table-wrap hidden md:block'>
            <table className='app-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className='break-all'>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes className='text-red-500' />}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes className='text-red-500' />
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className='app-btn-secondary !px-3 !py-1.5 text-xs'>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default OrderListScreen;
