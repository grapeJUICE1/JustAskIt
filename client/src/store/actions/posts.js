import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchPostsStart = () => {
  return {
    type: actionTypes.FETCH_POSTS_START,
  };
};
export const fetchPostsFail = (error) => {
  return {
    type: actionTypes.FETCH_POSTS_FAIL,
    error,
  };
};
export const fetchPostsSuccess = (posts, total, totalPages) => {
  return {
    type: actionTypes.FETCH_POSTS_SUCCESS,
    posts,
    total,
    totalPages,
  };
};

export const fetchPosts = (
  sortBy,
  filter,
  currentPage,
  perPagePosts,
  userId
) => {
  return async (dispatch) => {
    dispatch(fetchPostsStart());
    try {
      let link = '/posts';
      if (userId) {
        link = `/posts/${userId}/get-posts-of-user`;
      }

      const res = await axios.get(link, {
        params: {
          sort: sortBy,
          limit: perPagePosts,
          page: currentPage,
          ...filter,
        },
      });

      dispatch(
        fetchPostsSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchPostsFail(err.response.data));
      else dispatch(fetchPostsFail(err));
    }
  };
};