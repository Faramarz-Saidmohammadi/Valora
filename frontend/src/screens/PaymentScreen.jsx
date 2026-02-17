import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <div className='app-card space-y-6'>
        <div>
          <p className='app-subheading'>Checkout</p>
          <h1 className='app-heading mt-2'>Payment Method</h1>
          <p className='mt-2 text-sm text-slate-500'>Choose a secure payment option for this order.</p>
        </div>
        <form onSubmit={submitHandler} className='space-y-4'>
          <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700'>
            <input
              type='radio'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal or Credit Card
          </label>
          <button type='submit' className='app-btn w-full'>
            Review Order
          </button>
          <p className='text-center text-xs text-slate-500'>PCI-compliant checkout flow.</p>
        </form>
      </div>
    </FormContainer>
  );
};

export default PaymentScreen;
