import axiosPosts from '../../axios-instances/axios-post';
import axiosAnswers from '../../axios-instances/axios-answers';
import * as actionTypes from './actionTypes';

export const fetchFullPostStart = () => {
  return {
    type: actionTypes.FETCH_FULL_POST_START,
  };
};
export const fetchFullPostFail = (error) => {
  return {
    type: actionTypes.FETCH_FULL_POST_FAIL,
    error,
  };
};
export const fetchFullPostSuccess = (post) => {
  return {
    type: actionTypes.FETCH_FULL_POST_SUCCESS,
    post,
  };
};

export const fetchFullPost = (postId) => {
  return async (dispatch) => {
    dispatch(fetchFullPostStart());
    try {
      const res = await axiosPosts.get(`/${postId}`);

      dispatch(fetchFullPostSuccess(res.data.data.doc));
    } catch (err) {
      dispatch(fetchFullPostFail(err));
    }
  };
};

export const fetchAnswersStart = () => {
  return {
    type: actionTypes.FETCH_ANSWERS_START,
  };
};
export const fetchAnswersFail = (error) => {
  return {
    type: actionTypes.FETCH_ANSWERS_FAIL,
    error,
  };
};
export const fetchAnswersSuccess = (answers, total) => {
  return {
    type: actionTypes.FETCH_ANSWERS_SUCCESS,
    answers,
    total,
  };
};
export const fetchAnswers = (postId) => {
  return async (dispatch) => {
    dispatch(fetchAnswersStart());
    try {
      const res = await axiosAnswers.get(`/${postId}/get-answers`);
      // console.log(res);
      dispatch(fetchAnswersSuccess(res.data.data.docs, res.data.results));
    } catch (err) {
      dispatch(fetchAnswersFail(err));
    }
  };
};
