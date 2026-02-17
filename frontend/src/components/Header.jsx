import { useState } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b border-white/50 bg-white/55 backdrop-blur-xl'>
      <div className='app-container'>
        <div className='flex h-20 items-center justify-between gap-3'>
          <Link to='/' className='flex items-center gap-3 text-lg font-semibold tracking-[-0.01em] text-ink'>
            <span>Valora</span>
          </Link>
          <button
            type='button'
            className='app-btn-secondary md:hidden'
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
          <div
            className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-20 max-h-[calc(100vh-5rem)] w-full flex-col gap-3 overflow-y-auto border-b border-slate-200 bg-white p-4 md:static md:flex md:max-h-none md:w-auto md:flex-row md:items-center md:overflow-visible md:border-none md:bg-transparent md:p-0`}
          >
            <SearchBox />
            <button
              type='button'
              onClick={() => setDrawerOpen(true)}
              className='inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'
            >
              <FaShoppingCart />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className='rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white'>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>

            {userInfo ? (
              <details className='group relative'>
                <summary className='list-none cursor-pointer rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'>
                  {userInfo.name}
                </summary>
                <div className='mt-2 min-w-[10rem] rounded-xl border border-slate-200 bg-white p-2 shadow-soft md:absolute md:right-0'>
                  <Link to='/profile' className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Profile
                  </Link>
                  <button
                    type='button'
                    onClick={logoutHandler}
                    className='block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100'
                  >
                    Logout
                  </button>
                </div>
              </details>
            ) : (
              <Link
                to='/login'
                className='inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'
              >
                <FaUser />
                <span>Sign In</span>
              </Link>
            )}

            {userInfo?.isAdmin && (
              <details className='group relative'>
                <summary className='list-none cursor-pointer rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'>
                  Admin
                </summary>
                <div className='mt-2 min-w-[11rem] rounded-xl border border-slate-200 bg-white p-2 shadow-soft md:absolute md:right-0'>
                  <Link to='/admin/productlist' className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Products
                  </Link>
                  <Link to='/admin/orderlist' className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Orders
                  </Link>
                  <Link to='/admin/userlist' className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Users
                  </Link>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartItems={cartItems}
      />
    </header>
  );
};

export default Header;
