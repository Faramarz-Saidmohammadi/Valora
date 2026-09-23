import { Outlet } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
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
