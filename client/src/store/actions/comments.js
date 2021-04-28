import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that
import axiosGetLikesDislikes from 'axios';

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
        `/comments/${docId}/get-comments-of-${forDoc}`
      );
      dispatch(fetchCommentsSuccess(res.data.data.docs, forDoc, docId));

      for (let cmnt of res.data.data.docs) {
        dispatch(checkUsersLikeDislikeComment(cmnt._id, cmnt.doc));
      }
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

      dispatch(
        checkUsersLikeDislikeComment(
          res.data.data.doc._id,
          res.data.data.doc.doc
        )
      );
    } catch (err) {
      console.log(err);
      // dispatch(checkUsersLikeDislikeAnswerFail());
    }
  };
};

export const checkUsersLikeDislikeCommentSuccess = (response, id, ansId) => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_COMMENT,
    response,
    id,
    ansId,
  };
};
export const checkUsersLikeDislikeCommentFail = () => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_COMMENT_FAIL,
  };
};

export const checkUsersLikeDislikeComment = (commentId, ansId) => {
  return async (dispatch) => {
    try {
      const res = await axiosGetLikesDislikes.get(
        `/comments/${commentId}/get-all-reactions-of-user`,
        { withCredentials: true }
      );

      dispatch(
        checkUsersLikeDislikeCommentSuccess(res.data.data, commentId, ansId)
      );
    } catch (err) {
      console.log(err);
      dispatch(checkUsersLikeDislikeCommentFail());
    }
  };
};
