import axios from '../../axios-main';
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
      const res = await axios.get(`/posts/${postId}`);

      dispatch(fetchFullPostSuccess(res.data.data.doc));
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchFullPostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(fetchFullPostFail(err));
    }
  };
};

export const LikePostStart = () => {
  return {
    type: actionTypes.LIKE_POST_START,
  };
};
export const LikePostFail = (error) => {
  return {
    type: actionTypes.LIKE_POST_FAIL,
    error,
  };
};
export const LikePostSuccess = (post) => {
  return {
    type: actionTypes.LIKE_POST_SUCCESS,
    post,
  };
};

export const LikePost = (postId, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(LikePostStart());
    try {
      const res = await axios.post(`/posts/${postId}/${likeordislike}`);
      dispatch(LikePostSuccess(res.data.data.doc));
    } catch (err) {
      console.log(err);
      if (err.response.data.message) dispatch(LikePostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(LikePostFail(err));
    }
  };
};
