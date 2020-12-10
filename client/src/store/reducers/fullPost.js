import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  post: {},
  answers: [],
  error: null,
  loading: false,
};

const fetchFullPostStartHandler = (state, action) => {
  return updateObj(state, { error: null, post: {}, loading: true });
};
const fetchFullPostSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    post: action.post,
    loading: false,
  });
};
const fetchFullPostFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
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
const likePostStartHandler = (state, action) => {
  return updateObj(state, { error: null });
};
const likePostSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    loading: false,
    post: action.post,
  });
};
const likePostFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
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
    case actionTypes.LIKE_POST_START:
      return likePostStartHandler(state, action);
    case actionTypes.LIKE_POST_SUCCESS:
      return likePostSuccessHandler(state, action);
    case actionTypes.LIKE_POST_FAIL:
      return likePostFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
