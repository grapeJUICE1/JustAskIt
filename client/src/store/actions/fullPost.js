import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that
import axiosGetLikesDislikes from 'axios';

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

export const LikeDislikePostStart = () => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_START,
  };
};
export const LikeDislikePostFail = (error) => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_FAIL,
    error,
  };
};
export const LikeDislikePostSuccess = (post) => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_SUCCESS,
    post,
  };
};

export const LikeDislikePost = (postId, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(LikeDislikePostStart());
    try {
      const res = await axios.post(`/posts/${postId}/${likeordislike}`);
      dispatch(LikeDislikePostSuccess(res.data.data.doc));
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(LikeDislikePostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(LikeDislikePostFail(err));
    }
  };
};

export const checkUsersLikeDislikePostSuccess = (response) => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_POST,
    response,
  };
};
export const checkUsersLikeDislikePostFail = () => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_POST_FAIL,
  };
};
export const checkUsersLikeDislikePost = (postId) => {
  return async (dispatch) => {
    try {
      const res = await axiosGetLikesDislikes.get(
        `/posts/${postId}/get-all-reactions-of-user`,
        { withCredentials: true }
      );
      dispatch(checkUsersLikeDislikePostSuccess(res.data.data));
    } catch (err) {
      console.log(err);
      dispatch(checkUsersLikeDislikePostFail());
    }
  };
};
