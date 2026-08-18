import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = Date.now();

      if (currentTime > Number(expirationTime)) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <div className='app-shell'>
      <ToastContainer position='top-center' autoClose={2500} />
      <Header />
      <main className='min-h-[80vh] py-5 sm:py-8'>
        <div className='app-container'>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
