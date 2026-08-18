import { useState } from 'react';
import { FaBars, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
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

  const closeMenu = () => setMenuOpen(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      closeMenu();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <header className='sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-xl'>
      <div className='app-container'>
        <div className='flex h-20 items-center justify-between gap-3'>
          <Link
            to='/'
            onClick={closeMenu}
            className='flex items-center gap-3 text-xl font-semibold tracking-[-0.03em] text-ink'
            aria-label='Valora home'
          >
            <span className='grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm'>
              V
            </span>
            <span>Valora</span>
          </Link>

          <button
            type='button'
            className='app-btn-secondary h-10 w-10 p-0 md:hidden'
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls='primary-navigation'
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <FaTimes aria-hidden='true' /> : <FaBars aria-hidden='true' />}
          </button>

          <div
            id='primary-navigation'
            className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-20 max-h-[calc(100vh-5rem)] w-full flex-col gap-3 overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-lg md:static md:flex md:max-h-none md:w-auto md:flex-row md:items-center md:overflow-visible md:border-none md:bg-transparent md:p-0 md:shadow-none`}
          >
            <SearchBox />

            <button
              type='button'
              onClick={() => {
                setDrawerOpen(true);
                closeMenu();
              }}
              className='inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'
              aria-label={`Open cart${cartCount ? ` with ${cartCount} items` : ''}`}
            >
              <FaShoppingCart aria-hidden='true' />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className='rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white'>
                  {cartCount}
                </span>
              )}
            </button>

            {userInfo ? (
              <details className='group relative'>
                <summary className='list-none cursor-pointer rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'>
                  {userInfo.name}
                </summary>
                <div className='mt-2 min-w-[10rem] rounded-xl border border-slate-200 bg-white p-2 shadow-soft md:absolute md:right-0'>
                  <Link
                    to='/profile'
                    onClick={closeMenu}
                    className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'
                  >
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
                onClick={closeMenu}
                className='inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'
              >
                <FaUser aria-hidden='true' />
                <span>Sign In</span>
              </Link>
            )}

            {userInfo?.isAdmin && (
              <details className='group relative'>
                <summary className='list-none cursor-pointer rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'>
                  Admin
                </summary>
                <div className='mt-2 min-w-[11rem] rounded-xl border border-slate-200 bg-white p-2 shadow-soft md:absolute md:right-0'>
                  <Link to='/admin/productlist' onClick={closeMenu} className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Products
                  </Link>
                  <Link to='/admin/orderlist' onClick={closeMenu} className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
                    Orders
                  </Link>
                  <Link to='/admin/userlist' onClick={closeMenu} className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
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
