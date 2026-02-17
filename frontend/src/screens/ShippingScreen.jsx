import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <div className='app-card space-y-6'>
        <div>
          <p className='app-subheading'>Checkout</p>
          <h1 className='app-heading mt-2'>Shipping Address</h1>
          <p className='mt-2 text-sm text-slate-500'>Used for delivery estimates and order updates.</p>
        </div>
        <form onSubmit={submitHandler} className='space-y-4'>
          <div>
            <label htmlFor='address' className='mb-1 block text-sm font-medium text-slate-700'>
              Address
            </label>
            <input
              id='address'
              type='text'
              placeholder='Enter address'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              className='app-input'
            />
          </div>
          <div>
            <label htmlFor='city' className='mb-1 block text-sm font-medium text-slate-700'>
              City
            </label>
            <input
              id='city'
              type='text'
              placeholder='Enter city'
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              className='app-input'
            />
          </div>
          <div>
            <label htmlFor='postalCode' className='mb-1 block text-sm font-medium text-slate-700'>
              Postal Code
            </label>
            <input
              id='postalCode'
              type='text'
              placeholder='Enter postal code'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
              className='app-input'
            />
          </div>
          <div>
            <label htmlFor='country' className='mb-1 block text-sm font-medium text-slate-700'>
              Country
            </label>
            <input
              id='country'
              type='text'
              placeholder='Enter country'
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
              className='app-input'
            />
          </div>
          <button type='submit' className='app-btn w-full'>
            Continue to Payment
          </button>
          <p className='text-center text-xs text-slate-500'>Your data is securely transmitted.</p>
        </form>
      </div>
    </FormContainer>
  );
};

export default ShippingScreen;
