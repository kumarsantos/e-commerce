import React, { useEffect, useState } from 'react';
import './Products.scss';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProducts } from '../../redux/actions/productAction';
import Loader from '../../components/layout/Loader/Loader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAlert } from 'react-alert';
import MetaData from '../../components/layout/MetaData';

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const Products = ({ match }) => {
  const [currentPage, setCurrentPageNo] = useState(1);
  const [price, setPrice] = useState(10000);
  const [fetchByPrice, setFetchByPrice] = useState(10000);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useAlert();

  const {
    loading,
    error,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.product);

  const queries = location?.search?.split('?')?.[1];

  const priceHandler = (e, newPrice) => {
    setPrice(() => newPrice);
    setTimeout(() => {
      setFetchByPrice(() => newPrice);
    }, 3000);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (queries) {
      dispatch(
        getProducts(
          `http://localhost:4000/api/v1/products?${queries}&page=${currentPage}&price[gte]=${0}&price[lte]=${fetchByPrice}&ratings[gte]=${rating}`
        )
      );
    } else {
      dispatch(
        getProducts(
          `http://localhost:4000/api/v1/products?page=${currentPage}&price[gte]=${0}&price[lte]=${fetchByPrice}&ratings[gte]=${rating}`
        )
      );
    }
  }, [dispatch, queries, currentPage, fetchByPrice, rating, error]);

  let count = filteredProductsCount;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title='PRODUCT -- ECOMMERCE' />
          <h2 className='productsHeading'>Products</h2>{' '}
          <div className='products'>
            {products?.map((item) => (
              <ProductCard product={item} key={item._id} />
            ))}
          </div>
          <div className='filterBox'>
            <Typography>Price</Typography>
            <PrettoSlider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay='auto'
              aria-labelledby='range-slider'
              disableSwap
              min={0}
              max={25000}
            />
          </div>
          <fieldset className='rating'>
            <Typography component='legend'>Ratings</Typography>
            <Slider
              value={rating}
              onChange={(e, newRating) => {
                setRating(newRating);
              }}
              aria-labelledby='continuous-slider'
              min={0}
              max={5}
              valueLabelDisplay='auto'
            />
          </fieldset>
          {resultPerPage < productsCount && (
            <div className='paginationBox'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={(e) => setCurrentPageNo(e)}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass='page-item'
                linkClass='page-link'
                activeClass='pageItemActive'
                activeLinkClass='pageLinkActive'
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
