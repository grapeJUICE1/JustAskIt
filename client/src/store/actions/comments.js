import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchCommentsStart = (forDoc) => {
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
        `/comments/${docId}/get-comments-of-${forDoc}`,
        {
          params: {
            sort: '-voteCount',
          },
        }
      );
      dispatch(fetchCommentsSuccess(res.data.data.docs, forDoc, docId));
    } catch (err) {
      console.log(err);
      // dispatch(checkUsersLikeDislikeAnswerFail());
    }
  };
};
export const likeDislikeCommentsStart = (forDoc) => {
  return {
    type: actionTypes[`LIKE_DISLIKE_${forDoc.toUpperCase()}_COMMENT_START`],
  };
};
export const likeDislikeCommentsFail = (error, forDoc) => {
  return {
    type: actionTypes[`LIKE_DISLIKE_${forDoc.toUpperCase()}_COMMENT_FAIL`],
    error,
  };
};
export const likeDislikeCommentsSuccess = (comments, forDoc, id) => {
  return {
    type: actionTypes[`LIKE_DISLIKE_${forDoc.toUpperCase()}_COMMENT_SUCCESS`],
    comments,
    doc: id,
  };
};
export const likeDislikeComments = (docId, forDoc, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(likeDislikeCommentsStart(forDoc));
    try {
      const res = await axios.post(`/comments/${docId}/${likeordislike}`);
      dispatch(likeDislikeCommentsSuccess(res.data.data.doc, forDoc, docId));
    } catch (err) {
      console.log(err);
      // dispatch(checkUsersLikeDislikeAnswerFail());
    }
  };
};
