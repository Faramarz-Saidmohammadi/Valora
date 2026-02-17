import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='app-btn-secondary mb-6'>
        Go Back
      </Link>
      <FormContainer>
        <div className='app-card'>
          <p className='app-subheading'>Admin</p>
          <h1 className='app-heading mb-6 mt-2'>Edit Product</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error.data.message}</Message>
          ) : (
            <form onSubmit={submitHandler} className='space-y-4'>
              <div>
                <label htmlFor='name' className='mb-1 block text-sm font-medium text-slate-700'>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label htmlFor='price' className='mb-1 block text-sm font-medium text-slate-700'>
                  Price
                </label>
                <input
                  id='price'
                  type='number'
                  placeholder='Enter price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label htmlFor='image' className='mb-1 block text-sm font-medium text-slate-700'>
                  Image URL
                </label>
                <input
                  id='image'
                  type='text'
                  placeholder='Enter image url'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label htmlFor='imageFile' className='mb-1 block text-sm font-medium text-slate-700'>
                  Upload Image
                </label>
                <input id='imageFile' onChange={uploadFileHandler} type='file' className='app-input' />
                {loadingUpload && <Loader />}
              </div>
              <div>
                <label htmlFor='brand' className='mb-1 block text-sm font-medium text-slate-700'>
                  Brand
                </label>
                <input
                  id='brand'
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label
                  htmlFor='countInStock'
                  className='mb-1 block text-sm font-medium text-slate-700'
                >
                  Count In Stock
                </label>
                <input
                  id='countInStock'
                  type='number'
                  placeholder='Enter countInStock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label htmlFor='category' className='mb-1 block text-sm font-medium text-slate-700'>
                  Category
                </label>
                <input
                  id='category'
                  type='text'
                  placeholder='Enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='app-input'
                />
              </div>
              <div>
                <label
                  htmlFor='description'
                  className='mb-1 block text-sm font-medium text-slate-700'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='app-input min-h-28'
                ></textarea>
              </div>
              <button type='submit' className='app-btn w-full'>
                Update
              </button>
            </form>
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
