import React, { useEffect, useRef, useState } from 'react';
import './Login.scss';
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
} from '../../redux/actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../../components/layout/Loader/Loader';

const Login = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {
    user: userDetails,
    loading,
    error,
    isAuthenticated,
  } = useSelector((state) => state.user);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(PreviewIcon);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switchTab = useRef(null);
  const file = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [error, dispatch, alert, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switchTab.current.classList.add("shiftToNeutral");
      switchTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switchTab.current.classList.add("shiftToRight");
      switchTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin({ loginEmail, loginPassword }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('name', name);
    myForm.append('email', email);
    myForm.append('password', password);
    myForm.append('avatar', avatar);
    dispatch(userRegister(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleFileSelect = (e) => {
    file.current.click();
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className='LoginSignUpContainer'>
        <div className='loginSignUpBox'>
          <div>
            <div className='login_signup_toggle'>
              <p onClick={(e) => switchTabs(e, 'login')}>LOGIN</p>
              <p onClick={(e) => switchTabs(e, 'register')}>REGISTER</p>
            </div>
            <button ref={switchTab}></button>
          </div>
          <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
            <div className='loginEmail'>
              <MdOutlineMailOutline />
              <input
                type='email'
                placeholder='Email'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className='loginPassword'>
              <BiLockOpenAlt />
              <input
                type='password'
                placeholder='Password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to={`/password/forgot`}>Forget Password ?</Link>
            <input type='submit' value='Login' className='loginBtn' />
          </form>

          <form
            className='signUpForm'
            ref={registerTab}
            encType='multipart/form-data'
            onSubmit={registerSubmit}
          >
            <div className='signUpName'>
              <TfiFaceSmile />
              <input
                type='text'
                placeholder='Name'
                required
                name='name'
                value={name}
                onChange={registerDataChange}
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
                onChange={registerDataChange}
              />
            </div>
            <div className='signUpPassword'>
              <BiLockOpenAlt />
              <input
                type='password'
                placeholder='Password'
                name='password'
                required
                value={password}
                onChange={registerDataChange}
              />
            </div>
            <div className='registerImage'>
              <img src={avatarPreview} alt='Avatar Preview' />
              <input
                type='file'
                name='avatar'
                ref={file}
                accept='image/*'
                onChange={registerDataChange}
              />
              <span onClick={handleFileSelect}>Choose File</span>
            </div>
            <input
              type='submit'
              value='Register'
              className='signUpBtn'
              disabled={loading ? true : false}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
