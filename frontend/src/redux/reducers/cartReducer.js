import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_CART_ITEM,
} from '../constants/cardConstant';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
      };
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };
    case ADD_TO_CART_SUCCESS:
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (val) => val.product === item.product
      );
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems?.map((obj) =>
            obj.product === isItemExist.product ? item : obj
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case ADD_TO_CART_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
