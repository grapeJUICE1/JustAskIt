import axios from '../../axios-main';
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
export const loginSuccess = (token, user) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token,
    user,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};
export const login = (data) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(`/users/login`, data);

      dispatch(loginSuccess(res.data.token, res.data.data.user));
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
export const signUpSuccess = (token, user) => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
    token,
    user,
  };
};

export const signup = (data) => {
  return async (dispatch) => {
    dispatch(signUpStart());
    try {
      const res = await axios.post(`/users/sign-up`, data);

      dispatch(signUpSuccess(res.data.token, res.data.data.user));
    } catch (err) {
      console.log(err);
      if (err.response.data.message) dispatch(signUpFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(signUpFail(err));
    }
  };
};

export const Logout = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`/users/logout`);
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };
};
