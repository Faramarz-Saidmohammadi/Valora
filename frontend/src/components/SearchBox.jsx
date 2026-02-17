import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className='glass-panel flex w-full items-center gap-2 rounded-2xl p-1.5 md:min-w-[18rem] md:w-auto'
    >
      <input
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='w-full rounded-xl border border-transparent bg-white/80 px-4 py-2 text-sm text-ink outline-none transition focus:border-brand-500 md:w-56'
      />
      <button type='submit' className='app-btn-secondary !border-brand-100 !bg-brand-50 !text-brand-700'>
        Search
      </button>
    </form>
  );
};

export default SearchBox;
