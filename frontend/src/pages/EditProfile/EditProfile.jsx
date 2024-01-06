import React, { useEffect, useRef, useState } from 'react';
import './EditProfile.scss';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineMailOutline } from 'react-icons/md';
import { BiLockOpenAlt } from 'react-icons/bi';
import { TfiFaceSmile } from 'react-icons/tfi';
import PreviewIcon from '/vite.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  userLogin,
  clearErrors,
  userRegister,
  updateProfile,
  loadUser,
} from '../../redux/actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../../components/layout/Loader/Loader';
import MetaData from '../../components/layout/MetaData';
import { UPDATE_PROFILE_RESET } from '../../redux/constants/userContant';

const EditProfile = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem('token');
  if (token) {
    token = JSON.parse(token);
  }
  const alert = useAlert();
  const { user: userDetails } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.profile);

  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const { name, email } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(PreviewIcon);

  const file = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setUser({
        name: userDetails?.name,
        email: userDetails?.email,
      });
      setAvatarPreview(userDetails?.avatar?.url);
    }

    if (error) {
      alert.error(error);
    }
    if (isUpdated) {
      alert.success('Profile updated successfully');
      dispatch(loadUser(token));
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate('/account');
    }
  }, [error, dispatch, alert, isUpdated, userDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('name', name);
    myForm.append('email', email);
    myForm.append('avatar', avatar);
    dispatch(updateProfile(myForm, token));
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectAvatar = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target?.files?.[0]);
  };

  const handleFileSelect = (e) => {
    file.current.click();
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <MetaData title={`${userDetails?.name}=update-profile`} />
      <div className='LoginSignUpContainer'>
        <div className='loginSignUpBox'>
          <h4>Update Profile</h4>
          <form
            className='signUpForm'
            encType='multipart/form-data'
            onSubmit={handleSubmit}
          >
            <div className='signUpName'>
              <TfiFaceSmile />
              <input
                type='text'
                placeholder='Name'
                required
                name='name'
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className='signUpEmail'>
              <TfiFaceSmile />
              <input
                type='email'
                placeholder='Email'
                required
                name='email'
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className='registerImage'>
              <img src={avatarPreview} alt='Avatar Preview' />
              <input
                type='file'
                name='avatar'
                ref={file}
                accept='image/*'
                onChange={handleSelectAvatar}
              />
              <span onClick={handleFileSelect}>Choose File</span>
            </div>
            <input
              type='submit'
              value='Update'
              className='signUpBtn'
              disabled={loading ? true : false}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
