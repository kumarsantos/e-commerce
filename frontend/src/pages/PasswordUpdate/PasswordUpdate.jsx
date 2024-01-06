import React, { useEffect, useState } from 'react';
import './PasswordUpdate.scss';
import { BiLockOpenAlt } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/layout/Loader/Loader';
import MetaData from '../../components/layout/MetaData';
import {
  clearErrors,
  loadUser,
  updatePassword,
} from '../../redux/actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../redux/constants/userContant';

const PasswordUpdate = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, error, isUpdated } = useSelector((state) => state.profile);

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    newConfirmPassword: '',
  });
  const { oldPassword, newPassword, newConfirmPassword } = password;

  let token = localStorage.getItem('token');
  if (token) {
    token = JSON.parse(token);
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success('Password updated successfully');
      dispatch(loadUser(token));
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate('/account');
    }
  }, [error, dispatch, alert, isUpdated]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('oldPassword', oldPassword);
    myForm.append('newPassword', newPassword);
    myForm.append('newConfirmPassword', newConfirmPassword);
    dispatch(updatePassword(myForm, token));
  };

  const handleChange = (e) => {
    setPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <MetaData title='Update Password' />
      <div className='UpdatePassword_container'>
        <form action='' onSubmit={handleUpdateProfile}>
          <h4>Update Password</h4>
          <div className='signUpPassword'>
            <BiLockOpenAlt />
            <input
              type='password'
              placeholder='Old password'
              name='oldPassword'
              required
              value={oldPassword}
              onChange={handleChange}
            />
          </div>
          <div className='signUpPassword'>
            <BiLockOpenAlt />
            <input
              type='password'
              placeholder='New password'
              name='newPassword'
              required
              value={newPassword}
              onChange={handleChange}
            />
          </div>
          <div className='signUpPassword'>
            <BiLockOpenAlt />
            <input
              type='password'
              placeholder='Confirm new password'
              name='newConfirmPassword'
              required
              value={newConfirmPassword}
              onChange={handleChange}
            />
          </div>
          <input
            type='submit'
            value='Submit'
            className='signUpBtn'
            disabled={loading ? true : false}
          />
        </form>
      </div>
    </>
  );
};

export default PasswordUpdate;
