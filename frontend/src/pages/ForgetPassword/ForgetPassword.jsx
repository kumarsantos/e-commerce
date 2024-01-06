import React, { useEffect, useState } from 'react';
import './ForgetPassword.scss';
import MetaData from '../../components/layout/MetaData';
import Loader from '../../components/layout/Loader/Loader';
import { MdMailOutline } from 'react-icons/md';
import { forgotPassword, clearErrors } from '../../redux/actions/userAction';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [email, setEmail] = useState('');

  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );

  let token = localStorage.getItem('token');
  if (token) {
    token = JSON.parse(token);
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
      navigate('/login');
    }
  }, [error, dispatch, alert, message]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <MetaData title='Forgot Password' />
      <div className='UpdatePassword_container'>
        <form action='' onSubmit={handleUpdateProfile}>
          <h4>Forgot Password</h4>
          <div className='signUpPassword'>
            <MdMailOutline />
            <input
              type='email'
              placeholder='Enter your email here!'
              name='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <input
            type='submit'
            value='Send'
            className='signUpBtn'
            // disabled={loading ? true : false}
          />
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
