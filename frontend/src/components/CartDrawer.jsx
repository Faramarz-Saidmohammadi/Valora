import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { FaTimes } from 'react-icons/fa';

const CartDrawer = ({ open, onClose, cartItems }) => {
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <>
      <div
        aria-hidden='true'
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      ></div>
      <aside
        ref={drawerRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='cart-drawer-title'
        aria-hidden={!open}
        className={`glass-panel fixed right-0 top-0 z-50 h-full w-full max-w-md transform overflow-y-auto p-4 sm:p-5 transition duration-200 ${open ? 'visible translate-x-0' : 'invisible translate-x-full'}`}
      >
        <div className='mb-5 flex items-center justify-between border-b border-slate-200 pb-4'>
          <h2 id='cart-drawer-title' className='text-lg font-semibold tracking-[-0.01em] text-ink'>Your Cart</h2>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            className='app-btn-secondary !p-2'
            aria-label='Close cart'
          >
            <FaTimes aria-hidden='true' />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600'>
            Your cart is currently empty.
          </p>
        ) : (
          <div className='space-y-3'>
            {cartItems.slice(0, 5).map((item) => (
              <article
                key={item._id}
                className='grid grid-cols-[56px,1fr] items-center gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 sm:grid-cols-[56px,1fr,70px]'
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-14 w-14 rounded-lg object-cover'
                />
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-ink'>{item.name}</p>
                  <p className='text-xs text-slate-500'>Qty {item.qty}</p>
                </div>
                <p className='col-span-2 text-right text-sm font-semibold text-ink sm:col-span-1'>${item.price}</p>
              </article>
            ))}
          </div>
        )}

        <div className='mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4'>
          <div className='flex items-center justify-between text-sm text-slate-600'>
            <span>Items</span>
            <span className='font-semibold text-ink'>{itemCount}</span>
          </div>
          <div className='flex items-center justify-between text-base'>
            <span className='font-medium text-slate-700'>Subtotal</span>
            <span className='text-lg font-semibold text-ink'>${subtotal}</span>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Link to='/cart' onClick={onClose} className='app-btn-secondary w-full'>
              View Cart
            </Link>
            <Link to='/shipping' onClick={onClose} className='app-btn w-full text-center'>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
