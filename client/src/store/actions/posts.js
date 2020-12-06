import axios from 'axios';
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

export const fetchPosts = (sortBy, filter, currentPage, perPagePosts) => {
  return async (dispatch) => {
    dispatch(fetchPostsStart());
    try {
      const res = await axios.get('http://localhost:7000/api/v1/posts', {
        params: {
          sort: sortBy,
          limit: perPagePosts,
          page: currentPage,
          ...filter,
        },
      });
      //   this.setState({ total: res.data.results });
      //   this.setState({ totalPages: res.data.totalNumOfData });
      //   this.setState({ posts: res.data.data.docs });
      dispatch(
        fetchPostsSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
    } catch (err) {
      dispatch(fetchPostsFail(err));
    }
  };
};
