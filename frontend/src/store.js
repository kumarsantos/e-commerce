import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import productReducer, {
  singleProductReducer,
} from './redux/reducers/productReducer';
import {
  userReducer,
  profileReducer,
  forgotPasswordReducer,
} from './redux/reducers/userReducer';
import { cartReducer } from './redux/reducers/cartReducer';

let initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
const middleware = [thunk];

const reducer = combineReducers({
  product: productReducer,
  singleProduct: singleProductReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
});

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
