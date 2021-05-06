import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  profile: '',
  error: null,
  loading: false,
  modalLoading: false,
};
const getUserDataHandler = (state, action) => {
  return updateObj(state, { error: null, loading: true });
};
const getUserDataFailHandler = (state, action) => {
  return updateObj(state, { error: action.err, loading: false });
};

const getUserDataSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    testErr: false,
    profile: action.data,
    loading: false,
    total: action.total,
  });
};
const editUserDataStartHandler = (state, action) => {
  return updateObj(state, { error: null, modalLoading: true, testErr: null });
};
const editUserDataFailHandler = (state, action) => {
  return updateObj(state, { modalLoading: false, testErr: action.error });
};

const editUserDataSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    modalLoading: false,
    profile: action.user,
  });
};
const uploadPhotoStartHandler = (state, action) => {
  return updateObj(state, { error: null, modalLoading: true });
};
const uploadPhotoFailHandler = (state, action) => {
  console.log(action);
  return updateObj(state, { modalLoading: false });
};

const uploadPhotoSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    modalLoading: false,
    profile: action.user,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_DATA:
      return getUserDataHandler(state, action);
    case actionTypes.GET_USER_DATA_SUCCESS:
      return getUserDataSuccessHandler(state, action);
    case actionTypes.GET_USER_DATA_FAIL:
      return getUserDataFailHandler(state, action);
    case actionTypes.EDIT_USER_DATA_START:
      return editUserDataStartHandler(state, action);
    case actionTypes.EDIT_USER_DATA_SUCCESS:
      return editUserDataSuccessHandler(state, action);
    case actionTypes.EDIT_USER_DATA_FAIL:
      return editUserDataFailHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_START:
      return uploadPhotoStartHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_SUCCESS:
      return uploadPhotoSuccessHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_FAIL:
      return uploadPhotoFailHandler(state, action);

    default:
      return state;
  }
};

export default reducer;
