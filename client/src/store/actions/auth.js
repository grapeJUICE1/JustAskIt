import axios from '../../axios-main';
//importing axios because main instance has an error handling interceptor
//when i auto login , i dont want to trigger that
import axiosAutoLogin from 'axios';
import * as actionTypes from './actionTypes';

export const loginStart = () => {
  return {
    type: actionTypes.LOGIN_START,
  };
};
export const loginFail = (error) => {
  return {
    type: actionTypes.LOGIN_FAIL,
    error,
  };
};
export const loginSuccess = (user) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,

    user,
  };
};

export const login = (data) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(`/users/login`, data);
      localStorage.setItem('jwt', res.data.token);
      dispatch(loginSuccess(res.data.data.user));
    } catch (err) {
      console.log(err);
      if (err.response.data.message) dispatch(loginFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(loginFail(err));
    }
  };
};

export const signUpStart = () => {
  return {
    type: actionTypes.SIGNUP_START,
  };
};
export const signUpFail = (error) => {
  return {
    type: actionTypes.SIGNUP_FAIL,
    error,
  };
};
export const signUpSuccess = (user) => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,

    user,
  };
};

export const signup = (data) => {
  return async (dispatch) => {
    dispatch(signUpStart());
    try {
      const res = await axios.post(`/users/sign-up`, data);
      localStorage.setItem('jwt', res.data.token);
      dispatch(signUpSuccess(res.data.data.user));
    } catch (err) {
      console.log(err);
      if (err.response.data.message) dispatch(signUpFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(signUpFail(err));
    }
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

export const logoutFail = (err) => {
  return {
    type: actionTypes.LOGOUT_FAIL,
    error: err,
  };
};
export const logout = () => {
  return async (dispatch) => {
    try {
      await axios.post(`/users/logout`);
      localStorage.setItem('jwt', '');
      dispatch(logoutSuccess());
    } catch (err) {
      console.log(err);
      dispatch(logoutFail(err));
    }
  };
};

export const autoLogin = () => {
  return async (dispatch) => {
    try {
      const res = await axiosAutoLogin.post(
        'http://localhost:7000/api/v1/users/verify',
        {
          type: 'autoLogin',
        }
      );

      dispatch(loginSuccess(res.data.data.user));
    } catch (err) {
      console.log(err);
    }
  };
};
