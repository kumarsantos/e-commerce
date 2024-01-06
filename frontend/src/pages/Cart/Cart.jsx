import React from 'react';
import './Cart.scss';
import { useDispatch, useSelector } from 'react-redux';
import CartItemCard from './CartItemCard';
import { addItemsToCart } from '../../redux/actions/cartAction';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalPrice = cartItems?.reduce((value, obj) => {
    return (value += obj.price * obj.quantity);
  }, 0);

  const increaseQuantity = (id, quantity, stock) => {
    if (stock <= quantity) return;
    const newQty = quantity + 1;
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    if (1 >= quantity) return;
    const newQty = quantity - 1;
    dispatch(addItemsToCart(id, newQty));
  };

  const handleCheckout = () => {
    navigate(`/login?redirect=shipping`);
  };

  
  return (
    <div className='cartPage'>
      <div className='cartHeader'>
        <p>Product</p>
        <p>Quantity</p>
        <p>SubTotal</p>
      </div>
      <div className='cardContainer'>
        {cartItems?.map((item) => (
          <div key={item.product} className='itemWrapper'>
            <CartItemCard item={item} />
            <div className='cartInput'>
              <button
                onClick={(e) => decreaseQuantity(item.product, item.quantity)}
              >
                -
              </button>
              <input type='number' value={item.quantity} readOnly />
              <button
                onClick={(e) =>
                  increaseQuantity(item.product, item.quantity, item.stock)
                }
              >
                +
              </button>
            </div>
            <div className='subTotal'>
              <span>&#x20B9; {item?.price * item?.quantity}</span>
            </div>
          </div>
        ))}
        {cartItems?.length > 0 && (
          <div className='checkoutWrapper'>
            <div>
              <p className='line'></p>
              <div className='totalValue'>
                <span>Gross Total</span>
                <span>&#x20B9; {totalPrice}</span>
              </div>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        )}
        {cartItems?.length === 0 && (
          <div className='no_items'>
            <MdRemoveShoppingCart />
            <p>{cartItems?.length} Items in the cart</p>
            <button onClick={(e) => navigate('/products')}>
              View Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
