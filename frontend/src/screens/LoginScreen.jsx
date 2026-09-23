import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { getSafeRedirect } from '../utils/safeRedirect.mjs';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = getSafeRedirect(sp.get('redirect'));

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <div className='app-card'>
        <p className='app-subheading'>Welcome Back</p>
        <h1 className='app-heading mt-2 mb-6'>Sign In</h1>
        <form onSubmit={submitHandler} className='space-y-4'>
          <div>
            <label htmlFor='email' className='mb-1 block text-sm font-medium text-slate-700'>
              Email Address
            </label>
            <input
              id='email'
              type='email'
              placeholder='Enter email'
              value={email}
              required
              autoComplete='email'
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
              required
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              className='app-input'
            />
          </div>
          <button disabled={isLoading} type='submit' className='app-btn w-full'>
            Sign In
          </button>
          {isLoading && <Loader />}
        </form>
        <p className='mt-5 text-sm text-slate-600'>
          New Customer?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>Register</Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
