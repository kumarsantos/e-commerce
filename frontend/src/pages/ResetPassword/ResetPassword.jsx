import React, { useEffect, useState } from 'react';
import './ResetPassword.scss';
import { BiLockOpenAlt } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/layout/Loader/Loader';
import MetaData from '../../components/layout/MetaData';
import { clearErrors, resetPassword } from '../../redux/actions/userAction';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, success } = useSelector(
    (state) => state.forgotPassword
  );

  const [passwordObj, setPasswordObj] = useState({
    password: '',
    confirmPassword: '',
  });
  const { password, confirmPassword } = passwordObj;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Password updated successfully');
      navigate('/login');
    }
  }, [error, dispatch, alert, success]);

  const handlePasswordReset = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('password', password);
    myForm.append('confirmPassword', confirmPassword);
    dispatch(resetPassword(myForm, token));
  };

  const handleChange = (e) => {
    setPasswordObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <MetaData title='Reset Password' />
      <div className='UpdatePassword_container'>
        <form action='' onSubmit={handlePasswordReset}>
          <h4>Reset Password</h4>
          <div className='signUpPassword'>
            <BiLockOpenAlt />
            <input
              type='password'
              placeholder='New password'
              name='password'
              required
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className='signUpPassword'>
            <BiLockOpenAlt />
            <input
              type='password'
              placeholder='Confirm new password'
              name='confirmPassword'
              required
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
          <input
            type='submit'
            value='Reset'
            className='signUpBtn'
            disabled={loading ? true : false}
          />
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
