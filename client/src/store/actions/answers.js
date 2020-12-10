import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

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
      const res = await axios.get(`/answers/${postId}/get-answers`);
      // console.log(res);
      dispatch(fetchAnswersSuccess(res.data.data.docs, res.data.results));
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchAnswersFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(fetchAnswersFail(err));
    }
  };
};
