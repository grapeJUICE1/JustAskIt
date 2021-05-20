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
      const res = await axios.get(`/answers/${postId}/get-answers`, {
        params: {
          sort: '-voteCount',
        },
      });
      dispatch(fetchAnswersSuccess(res.data.data.docs, res.data.results));
      // for (let ans of res.data.data.docs) {
      //   dispatch(checkUsersLikeDislikeAnswer(ans._id));
      // }
    } catch (err) {
      // console.log(err);
      if (err.response) dispatch(fetchAnswersFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(fetchAnswersFail(err));
    }
  };
};

export const LikeDislikeAnswerStart = () => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_START,
  };
};
export const LikeDislikeAnswerFail = (error) => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_FAIL,
    error,
  };
};
export const LikeDislikeAnswerSuccess = (answer) => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_SUCCESS,
    answer,
  };
};

export const LikeDislikeAnswer = (postId, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(LikeDislikeAnswerStart());
    try {
      const res = await axios.post(`/answers/${postId}/${likeordislike}`);
      dispatch(LikeDislikeAnswerSuccess(res.data.data.doc));
      // dispatch(checkUsersLikeDislikeAnswer(postId));
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (!err.response.data.error.statusCode === 401)
          dispatch(LikeDislikeAnswerFail(err.response.data));
      }
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(LikeDislikeAnswerFail(err));
    }
  };
};
