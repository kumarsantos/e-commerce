import React, { useEffect, useRef, useState } from 'react';
import { BsCart4 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { BiLogIn } from 'react-icons/bi';
import { BiLogOut } from 'react-icons/bi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo2.avif';
import './Header.scss';
import {
  CATEGORIES_LIST,
  NAVIGATION_LINKS_LIST,
} from '../../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/userAction';
import { useAlert } from 'react-alert';
import UserOptions from '../../UserOptions/UserOptions';

const Header = () => {
  const searchedString = useRef('');
  const [searchKey, setSearchKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const isLoggedIn = isAuthenticated;
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useAlert();
  const dispatch = useDispatch();

  const handleSelectCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchedValueSubmit = () => {
    setSearchKey(searchedString.current);
  };

  const handleSearchClear = (e) => {
    searchedString.current = '';
    setSearchKey('');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleSearchedValueSubmit();
    }
    searchedString.current = e.target.value;
  };

  const handleSearchClicked = (e) => {
    handleSearchedValueSubmit();
  };

  const handleLogout = () => {
    dispatch(logout());
    alert.success('Logout Successfully');
  };

  useEffect(() => {
    const searchVal = searchKey?.trim() ?? '';
    const cat = selectedCategory !== 'All Categories' ? selectedCategory : '';

    if (cat && !searchVal) {
      navigate(`/products/?category=${selectedCategory}`);
    } else if (!cat && searchVal) {
      navigate(`/products/?keyword=${searchVal.trim()}`);
    } else if (!cat && !searchVal) {
      navigate(`/products`);
    } else {
      navigate(`?keyword=${searchVal}&category=${selectedCategory}`);
    }
  }, [selectedCategory, searchKey]);

  return (
    <div className='navbar_container' id='nav'>
      <div className='logo'>
        <Link to='/'>
          <img src={Logo} alt='logo' />
        </Link>
      </div>
      <div className='navbar_wrapper'>
        {!['/', '/account', '/me/update', '/orders'].includes(
          location?.pathname
        ) && (
          <div className='search'>
            <select onChange={handleSelectCategory}>
              <option>All Categories</option>
              {CATEGORIES_LIST?.map((cat, index) => (
                <option key={index}>{cat}</option>
              ))}
            </select>
            <input
              type='search'
              placeholder='Search here!'
              onChange={handleSearch}
              onKeyDown={handleSearch}
              onClick={handleSearchClear}
            />
            <span onClick={handleSearchClicked}>
              <BiSearch />
            </span>
          </div>
        )}
        <ul className='linkList'>
          {NAVIGATION_LINKS_LIST.map((link) => (
            <li className='linkListItem' key={link?.id}>
              <link.icon />
              <Link to={link?.url} className='link' state={link?.state}>
                {link?.label}
              </Link>
            </li>
          ))}
          {isLoggedIn ? (
            <li className='linkListItem' key='102' onClick={handleLogout}>
              <BiLogOut />
              <span className='link'>Logout</span>
            </li>
          ) : (
            <li className='linkListItem' key='101'>
              <BiLogIn />
              <Link to='/login' className='link'>
                SingIn/SingUp
              </Link>
            </li>
          )}
          {isLoggedIn && (
            // <li className='linkListItem' key='101'>
            //   <Link to='/account' className='link'>
            //     {user?.avatar?.url ? (
            //       <img src={user?.avatar?.url} alt='avatar' />
            //     ) : (
            //       <span className='initial'>{`${user?.name?.[0]}`}</span>
            //     )}
            //   </Link>
            <UserOptions user={user} />
            // </li>
          )}
          <li className='linkListItem' key='100'>
            <Link to={`/cart`} className='link'>
              <BsCart4 style={{ background: 'none', fontSize: '24px' }} />
              <span className='itemCount'>{cartItems?.length}</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
