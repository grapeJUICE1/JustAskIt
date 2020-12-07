import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  post: {},
  answers: null,
  error: null,
};

const fetchFullPostStartHandler = (state, action) => {
  return updateObj(state, { error: null, post: {} });
};
const fetchFullPostSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    post: action.post,
  });
};
const fetchFullPostFailHandler = (state, action) => {
  return updateObj(state, { error: action.error });
};
const fetchAnswersStartHandler = (state, action) => {
  return updateObj(state, { error: null, answers: [] });
};
const fetchAnswersSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    answers: action.answers,
  });
};
const fetchAnswersFailHandler = (state, action) => {
  return updateObj(state, { error: action.error });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FULL_POST_START:
      return fetchFullPostStartHandler(state, action);
    case actionTypes.FETCH_FULL_POST_SUCCESS:
      return fetchFullPostSuccessHandler(state, action);
    case actionTypes.FETCH_FULL_POST_FAIL:
      return fetchFullPostFailHandler(state, action);
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
