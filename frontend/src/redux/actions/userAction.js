import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_USER,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_RESET,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_RESET,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from '../constants/userContant';

export const userLogin =
  ({ loginEmail, loginPassword }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/user/login',
        { email: loginEmail, password: loginPassword },
        config
      );
      localStorage.setItem('token', JSON.stringify(data?.token));
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const userRegister = (userData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    dispatch({ type: REGISTER_REQUEST });
    const { data } = await axios.post(
      'http://localhost:4000/api/v1/user/register',
      userData,
      config
    );
    localStorage.setItem('token', JSON.stringify(data?.token));
    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const loadUser = (token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/user/me`,
      config
    );
    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    await axios.get('http://localhost:4000/api/v1/user/logout');
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT_USER, payload: {} });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateProfile = (userData, token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const { data } = await axios.put(
      'http://localhost:4000/api/v1/user/updateProfile',
      userData,
      config
    );
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updatePassword = (userData, token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    const { data } = await axios.put(
      'http://localhost:4000/api/v1/user/password/update',
      userData,
      config
    );
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: CHANGE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const { data } = await axios.post(
      'http://localhost:4000/api/v1/user/forgetPassword',
      { email },
      config
    );

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const resetPassword = (passwords, token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const { data } = await axios.put(
      `http://localhost:4000/api/v1//user/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};
