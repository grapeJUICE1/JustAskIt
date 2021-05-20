import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchTagsStart = () => {
  return {
    type: actionTypes.FETCH_TAGS_START,
  };
};
export const fetchTagsFail = (error) => {
  return {
    type: actionTypes.FETCH_TAGS_FAIL,
    error,
  };
};
export const fetchTagsSuccess = (tags, total, totalTags) => {
  return {
    type: actionTypes.FETCH_TAGS_SUCCESS,
    tags,
    total,
    totalTags,
  };
};

export const fetchTags = (
  sortBy,
  filter,
  currentPage,
  perPageTags,
  searchBy
) => {
  return async (dispatch) => {
    dispatch(fetchTagsStart());
    console.log('kkk');
    try {
      const res = await axios.get('/tags', {
        params: {
          sort: sortBy,
          limit: perPageTags,
          page: currentPage,
          search: searchBy,
          ...filter,
        },
      });
      console.log(res);
      dispatch(
        fetchTagsSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response.data.message) dispatch(fetchTagsFail(err.response.data));
      else dispatch(fetchTagsFail(err));
    }
  };
};
