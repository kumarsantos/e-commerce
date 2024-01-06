import React from 'react';
import './CartItemCard.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeItemFromCart } from '../../redux/actions/cartAction';
import { RiDeleteBin6Line } from "react-icons/ri";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItemFromCart = () => {
    dispatch(removeItemFromCart(item.product));
  };

  return (
    <div className='CartItemCard'>
      <img src={item.image} alt='item-pic' />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>Price: &#x20B9; {`${item.price}`}</span>
        <p onClick={handleRemoveItemFromCart}>
          <RiDeleteBin6Line /> Remove
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
