import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchUsersStart = () => {
  return {
    type: actionTypes.FETCH_USERS_START,
  };
};
export const fetchUsersFail = (error) => {
  return {
    type: actionTypes.FETCH_USERS_FAIL,
    error,
  };
};
export const fetchUsersSuccess = (users, total, totalUsers) => {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    users,
    total,
    totalUsers,
  };
};

export const fetchUsers = (
  sortBy,
  filter,
  currentPage,
  perPageUsers,
  searchBy
) => {
  return async (dispatch) => {
    dispatch(fetchUsersStart());
    try {
      const res = await axios.get('/users', {
        params: {
          sort: sortBy,
          limit: perPageUsers,
          page: currentPage,
          search: searchBy,
          ...filter,
        },
      });

      dispatch(
        fetchUsersSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchUsersFail(err.response.data));
      else dispatch(fetchUsersFail(err));
    }
  };
};
