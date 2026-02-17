const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-slate-200 bg-white/80 py-6'>
      <div className='app-container text-center text-sm text-slate-500'>
        <p className='m-0'>Valora &copy; {currentYear}</p>
      </div>
    </footer>
  );
};
export default Footer;
