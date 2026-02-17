import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <div className='app-card'>
        <p className='app-subheading'>Create Account</p>
        <h1 className='app-heading mt-2 mb-6'>Register</h1>
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
          <button disabled={isLoading} type='submit' className='app-btn w-full'>
            Register
          </button>
          {isLoading && <Loader />}
        </form>
        <p className='mt-5 text-sm text-slate-600'>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
