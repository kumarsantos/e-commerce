import React, { useEffect } from 'react';
import './Home.scss';
import { CgMouse } from 'react-icons/cg';
import ProductCard from '../../components/ProductCard/ProductCard';
import MetaData from '../../components/layout/MetaData';
import { clearErrors, getProducts } from '../../redux/actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/layout/Loader/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProducts('http://localhost:4000/api/v1/products'));
  }, [dispatch, error, alert]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <MetaData title='Ecommerce' />
      <div className='banner'>
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href='#container'>
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      <h2 className='homeHeading'>Featured Product</h2>
      <div className='container' id='container'>
        {products?.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </>
  );
};

export default Home;
