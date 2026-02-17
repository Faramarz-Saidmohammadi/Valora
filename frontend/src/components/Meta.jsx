import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Valora | Premium Electronics',
  description: 'Shop trusted electronics with secure checkout and fast shipping.',
  keywords: 'electronics, online shopping, gadgets, Valora',
};

export default Meta;
