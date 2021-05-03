import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  profile: '',
  error: null,
  loading: false,
};
const getUserDataHandler = (state, action) => {
  return updateObj(state, { error: null, answers: [], loading: true });
};
const getUserDataFailHandler = (state, action) => {
  console.log(action);
  return updateObj(state, { error: action.err, loading: false });
};

const getUserDataSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    profile: action.data,
    loading: false,
    total: action.total,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_DATA:
      return getUserDataHandler(state, action);
    case actionTypes.GET_USER_DATA_SUCCESS:
      return getUserDataSuccessHandler(state, action);
    case actionTypes.GET_USER_DATA_FAIL:
      return getUserDataFailHandler(state, action);

    default:
      return state;
  }
};

export default reducer;
