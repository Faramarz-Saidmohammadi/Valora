import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className='mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <p className='app-subheading'>Admin</p>
          <h1 className='app-heading mt-2'>Products</h1>
        </div>
        <button className='app-btn' onClick={createProductHandler}>
          <FaPlus className='mr-2' /> Create Product
        </button>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <div className='space-y-3 md:hidden'>
            {data.products.map((product) => (
              <article key={product._id} className='app-card space-y-2'>
                <p className='break-all text-xs text-slate-500'>{product._id}</p>
                <p className='text-sm'><span className='font-semibold'>Name:</span> {product.name}</p>
                <p className='text-sm'><span className='font-semibold'>Price:</span> ${product.price}</p>
                <p className='text-sm'><span className='font-semibold'>Category:</span> {product.category}</p>
                <p className='text-sm'><span className='font-semibold'>Brand:</span> {product.brand}</p>
                <div className='flex gap-2'>
                  <Link
                    to={`/admin/product/${product._id}/edit`}
                    className='app-btn-secondary !px-3 !py-1.5 text-xs'
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className='app-btn-danger !px-3 !py-1.5 text-xs'
                    onClick={() => deleteHandler(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className='app-table-wrap hidden md:block'>
            <table className='app-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td className='break-all'>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <div className='flex gap-2'>
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className='app-btn-secondary !px-3 !py-1.5 text-xs'
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className='app-btn-danger !px-3 !py-1.5 text-xs'
                          onClick={() => deleteHandler(product._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
