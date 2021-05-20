import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const getUserDataSuccess = (data) => {
  return {
    type: actionTypes.GET_USER_DATA_SUCCESS,
    data,
  };
};

export const getUserDataFail = (err) => {
  return {
    type: actionTypes.GET_USER_DATA_FAIL,
    err,
  };
};

export const getUserData = (userID) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`/users/${userID}`);
      console.log(res);
      dispatch(getUserDataSuccess(res.data.data.user));
    } catch (err) {
      dispatch(getUserDataFail(err.response.data.message));
    }
  };
};

export const editUserDataStart = () => {
  return {
    type: actionTypes.EDIT_USER_DATA_START,
  };
};
export const editUserDataFail = (error) => {
  return {
    type: actionTypes.EDIT_USER_DATA_FAIL,
    error,
  };
};
export const editUserDataSuccess = (user) => {
  return {
    type: actionTypes.EDIT_USER_DATA_SUCCESS,
    user,
  };
};
export const editUserData = (data) => {
  return async (dispatch) => {
    dispatch(editUserDataStart());
    try {
      console.log(data);
      const res = await axios.patch('/users/update-me', data);
      dispatch(editUserDataSuccess(res.data.data.user));
    } catch (err) {
      dispatch(editUserDataFail(err.response.data.message));
    }
  };
};

export const uploadPhotoStart = () => {
  return {
    type: actionTypes.UPLOAD_PHOTO_START,
  };
};
export const uploadPhotoFail = (error) => {
  return {
    type: actionTypes.UPLOAD_PHOTO_FAIL,
    error,
  };
};
export const uploadPhotoSuccess = (user) => {
  return {
    type: actionTypes.UPLOAD_PHOTO_SUCCESS,
    user,
  };
};

export const uploadPhoto = (data) => {
  return async (dispatch) => {
    dispatch(uploadPhotoStart());
    try {
      const res = await axios.patch('/users/upload-photo', data);
      dispatch(uploadPhotoSuccess(res.data.data.user));
    } catch (err) {
      dispatch(uploadPhotoFail(err.response.data.message));
    }
  };
};
