import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  total: 0,
  totalPosts: 0,
  posts: [],
  error: null,
  loading: false,
};

const fetchPostsStartHandler = (state, action) => {
  return updateObj(state, { error: null, posts: [], loading: true });
};
const fetchPostsSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    posts: action.posts,
    total: action.total,
    totalPosts: action.totalPosts,
    loading: false,
  });
};
const fetchPostsFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_POSTS_START:
      return fetchPostsStartHandler(state, action);
    case actionTypes.FETCH_POSTS_SUCCESS:
      return fetchPostsSuccessHandler(state, action);
    case actionTypes.FETCH_POSTS_FAIL:
      return fetchPostsFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
