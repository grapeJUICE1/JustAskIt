import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  post: {},
  error: null,
  loading: false,
  userDidLike: false,
  userDidDislike: false,
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

const checkUsersLikeDislikePost = (state, action) => {
  let userDidLike = state.userDidLike;
  let userDidDislike = state.userDidDislike;

  if (action.response.doc) {
    if (action.response.doc.type === 'like') {
      userDidLike = true;
      userDidDislike = false;
    } else if (action.response.doc.type === 'dislike') {
      userDidDislike = true;
      userDidLike = false;
    }
  } else {
    userDidLike = false;
    userDidDislike = false;
  }
  return updateObj(state, {
    userDidLike: userDidLike,
    userDidDislike: userDidDislike,
  });
};
const checkUsersLikeDislikePostFail = (state, action) => {
  return updateObj(state, {
    userDidLike: false,
    userDidDislike: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FULL_POST_START:
      return fetchFullPostStartHandler(state, action);
    case actionTypes.FETCH_FULL_POST_SUCCESS:
      return fetchFullPostSuccessHandler(state, action);
    case actionTypes.FETCH_FULL_POST_FAIL:
      return fetchFullPostFailHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_START:
      return likePostStartHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_SUCCESS:
      return likePostSuccessHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_FAIL:
      return likePostFailHandler(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_POST:
      return checkUsersLikeDislikePost(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_POST_FAIL:
      return checkUsersLikeDislikePostFail(state, action);
    default:
      return state;
  }
};

export default reducer;
