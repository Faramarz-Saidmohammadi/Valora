import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <section className='grid gap-6 lg:grid-cols-12'>
      <div className='lg:col-span-4'>
        <div className='app-card'>
          <p className='app-subheading'>Account</p>
          <h2 className='mb-5 mt-2 text-xl font-semibold tracking-[-0.01em] text-ink'>User Profile</h2>
          <form onSubmit={submitHandler} className='space-y-4'>
            <div>
              <label htmlFor='name' className='mb-1 block text-sm font-medium text-slate-700'>
                Name
              </label>
              <input
                id='name'
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='app-input'
              />
            </div>
            <div>
              <label htmlFor='email' className='mb-1 block text-sm font-medium text-slate-700'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='app-input'
              />
            </div>
            <div>
              <label htmlFor='password' className='mb-1 block text-sm font-medium text-slate-700'>
                Password
              </label>
              <input
                id='password'
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='app-input'
              />
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='mb-1 block text-sm font-medium text-slate-700'
              >
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='app-input'
              />
            </div>
            <button type='submit' className='app-btn w-full'>
              Update
            </button>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
      <div className='lg:col-span-8'>
        <p className='app-subheading'>History</p>
        <h2 className='mb-4 mt-2 text-xl font-semibold tracking-[-0.01em] text-ink'>My Orders</h2>
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
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
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
      </div>
    </section>
  );
};

export default ProfileScreen;
