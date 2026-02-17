import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign In', enabled: step1, to: '/login' },
    { label: 'Shipping', enabled: step2, to: '/shipping' },
    { label: 'Payment', enabled: step3, to: '/payment' },
    { label: 'Place Order', enabled: step4, to: '/placeorder' },
  ];

  return (
    <div className='mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4'>
      {steps.map((step, index) =>
        step.enabled ? (
          <Link
            key={step.label}
            to={step.to}
            className='flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700'
          >
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white'>
              {index + 1}
            </span>
            <span className='truncate'>{step.label}</span>
          </Link>
        ) : (
          <span
            key={step.label}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400'
          >
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[11px] font-bold text-white'>
              {index + 1}
            </span>
            <span className='truncate'>{step.label}</span>
          </span>
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
