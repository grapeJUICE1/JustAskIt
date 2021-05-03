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

      dispatch(getUserDataSuccess(res.data.data.user));
    } catch (err) {
      dispatch(getUserDataFail(err.message));
    }
  };
};
