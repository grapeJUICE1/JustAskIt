import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const loginStartHandler = (state, action) => {
  return updateObj(state, { error: null, loading: true });
};
const loginSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    user: action.user,
    token: action.token,
    loading: false,
  });
};
const loginFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};
const logoutHandler = (state, action) => {
  return updateObj(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return loginStartHandler(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccessHandler(state, action);
    case actionTypes.LOGIN_FAIL:
      return loginFailHandler(state, action);
    case actionTypes.LOGOUT:
      return logoutHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
