import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success('user updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/userlist' className='app-btn-secondary mb-6'>
        Go Back
      </Link>
      <FormContainer>
        <div className='app-card'>
          <p className='app-subheading'>Admin</p>
          <h1 className='app-heading mb-6 mt-2'>Edit User</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error}</Message>
          ) : (
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
              <label className='flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700'>
                <input
                  id='isadmin'
                  type='checkbox'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                Is Admin
              </label>
              <button type='submit' className='app-btn w-full'>
                Update
              </button>
            </form>
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
