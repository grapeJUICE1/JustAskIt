import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  answers: [],
  error: null,
  loading: false,
};

const fetchAnswersStartHandler = (state, action) => {
  return updateObj(state, { error: null, answers: [], loading: true });
};
const fetchAnswersSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    answers: action.answers,
    loading: false,
  });
};
const fetchAnswersFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ANSWERS_START:
      return fetchAnswersStartHandler(state, action);
    case actionTypes.FETCH_ANSWERS_SUCCESS:
      return fetchAnswersSuccessHandler(state, action);
    case actionTypes.FETCH_ANSWERS_FAIL:
      return fetchAnswersFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
