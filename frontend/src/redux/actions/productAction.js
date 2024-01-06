import axios from 'axios';
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  SINGLE_PRODUCT_REQUEST,
  SINGLE_PRODUCT_SUCCESS,
  SINGLE_PRODUCT_FAIL,
} from '../constants/productConstant';

export const getProducts = (url) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const { data } = await axios.get(url);
    dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getSingleProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: SINGLE_PRODUCT_REQUEST });
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );
    dispatch({ type: SINGLE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SINGLE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const clearErrors =()=> async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
