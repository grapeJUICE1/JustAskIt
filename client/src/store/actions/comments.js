import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that
import axiosGetLikesDislikes from 'axios';

export const fetchCommentsStart = (forDoc) => {
  console.log(forDoc.toUpperCase());
  return {
    type: actionTypes[`FETCH_${forDoc.toUpperCase()}_COMMENTS_START`],
  };
};
export const fetchCommentsFail = (error, forDoc) => {
  return {
    type: actionTypes[`FETCH_${forDoc.toUpperCase()}_COMMENTS_FAIL`],
    error,
  };
};
export const fetchCommentsSuccess = (comments, forDoc, id) => {
  return {
    type: actionTypes[`FETCH_${forDoc.toUpperCase()}_COMMENTS_SUCCESS`],
    comments,
    id,
  };
};
export const fetchComments = (docId, forDoc) => {
  return async (dispatch) => {
    dispatch(fetchCommentsStart(forDoc));
    try {
      const res = await axios.get(
        `/comments/${docId}/get-comments-of-${forDoc}`
      );
      console.log(res.data.data.docs);
      dispatch(fetchCommentsSuccess(res.data.data.docs, forDoc, docId));
    } catch (err) {
      console.log(err);
      // dispatch(checkUsersLikeDislikeAnswerFail());
    }
  };
};
