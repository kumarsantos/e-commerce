import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_CART_ITEM,
} from '../constants/cardConstant';
import axios from 'axios';

export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data?.product?.images?.[0]?.url,
        stock: data.product.stock,
        quantity,
      },
    });

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {
    dispatch({ type: ADD_TO_CART_FAIL, payload: error.response.data.message });
  }
};

export const removeItemFromCart = (id) => async (dispatch, getState) => {
  let cartItemList = localStorage.getItem('cartItems');
  if (cartItemList) {
    cartItemList = JSON.parse(localStorage.getItem('cartItems'));
  }
  const listWithoutItemToBeRemoved = cartItemList?.filter(
    (item) => item.product !== id
  );
  localStorage.setItem('cartItems', JSON.stringify(listWithoutItemToBeRemoved));
  dispatch({ type: REMOVE_CART_ITEM, payload: listWithoutItemToBeRemoved });
};
