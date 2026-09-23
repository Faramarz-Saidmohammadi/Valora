import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteUser(id).unwrap();
        await refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <p className='app-subheading'>Admin</p>
      <h1 className='app-heading mb-6 mt-2'>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className='space-y-3 md:hidden'>
            {users.map((user) => (
              <article key={user._id} className='app-card space-y-2'>
                <p className='break-all text-xs text-slate-500'>{user._id}</p>
                <p className='text-sm'><span className='font-semibold'>Name:</span> {user.name}</p>
                <p className='text-sm'>
                  <span className='font-semibold'>Email:</span>{' '}
                  <a className='break-all' href={`mailto:${user.email}`}>{user.email}</a>
                </p>
                <p className='text-sm'>
                  <span className='font-semibold'>Admin:</span> {user.isAdmin ? 'Yes' : 'No'}
                </p>
                {!user.isAdmin && (
                  <div className='flex gap-2'>
                    <Link
                      to={`/admin/user/${user._id}/edit`}
                      className='app-btn-secondary !px-3 !py-1.5 text-xs'
                      aria-label={`Edit ${user.name}`}
                    >
                      <FaEdit aria-hidden='true' />
                    </Link>
                    <button
                      type='button'
                      className='app-btn-danger !px-3 !py-1.5 text-xs'
                      onClick={() => deleteHandler(user._id)}
                      aria-label={`Delete ${user.name}`}
                    >
                      <FaTrash aria-hidden='true' />
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className='app-table-wrap hidden md:block'>
            <table className='app-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className='break-all'>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a className='break-all' href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td className={user.isAdmin ? 'text-emerald-700' : 'text-slate-600'}>
                      {user.isAdmin ? 'Yes' : 'No'}
                    </td>
                    <td>
                      {!user.isAdmin && (
                        <div className='flex gap-2'>
                          <Link
                            to={`/admin/user/${user._id}/edit`}
                            className='app-btn-secondary !px-3 !py-1.5 text-xs'
                            aria-label={`Edit ${user.name}`}
                          >
                            <FaEdit aria-hidden='true' />
                          </Link>
                          <button
                            type='button'
                            className='app-btn-danger !px-3 !py-1.5 text-xs'
                            onClick={() => deleteHandler(user._id)}
                            aria-label={`Delete ${user.name}`}
                          >
                            <FaTrash aria-hidden='true' />
                          </button>
                        </div>
                      )}
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

export default UserListScreen;
