import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  answers: [],
  error: null,
  loading: false,
  userDidLike: false,
  userDidDislike: false,
  total: 0,
};

const fetchAnswersStartHandler = (state, action) => {
  return updateObj(state, { error: null, answers: [], loading: true });
};
const fetchAnswersSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    answers: action.answers,
    loading: false,
    total: action.total,
  });
};
const fetchAnswersFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const likeAnswerStartHandler = (state, action) => {
  return updateObj(state, { error: null });
};
const likeAnswerSuccessHandler = (state, action) => {
  let answer = action.answer;
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === answer._id
  );
  answersCopy[updatedAnswerIndex] = answer;
  return updateObj(state, {
    error: null,
    loading: false,
    answers: answersCopy,
  });
};
const likeAnswerFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const checkUsersLikeDislikeAnswer = (state, action) => {
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.id
  );

  if (action.response.doc) {
    if (action.response.doc.type === 'like') {
      answersCopy[updatedAnswerIndex].userDidLike = true;
      answersCopy[updatedAnswerIndex].userDidDislike = false;
    } else if (action.response.doc.type === 'dislike') {
      answersCopy[updatedAnswerIndex].userDidDislike = true;
      answersCopy[updatedAnswerIndex].userDidLike = false;
    }
  } else {
    answersCopy[updatedAnswerIndex].userDidLike = false;
    answersCopy[updatedAnswerIndex].userDidDislike = false;
  }
  return updateObj(state, {
    answers: answersCopy,
  });
};
const checkUsersLikeDislikeAnswerFail = (state, action) => {
  return updateObj(state, {
    userDidLike: false,
    userDidDislike: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ANSWERS_START:
      return fetchAnswersStartHandler(state, action);
    case actionTypes.FETCH_ANSWERS_SUCCESS:
      return fetchAnswersSuccessHandler(state, action);
    case actionTypes.FETCH_ANSWERS_FAIL:
      return fetchAnswersFailHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_START:
      return likeAnswerStartHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_SUCCESS:
      return likeAnswerSuccessHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_FAIL:
      return likeAnswerFailHandler(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER:
      return checkUsersLikeDislikeAnswer(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_FAIL:
      return checkUsersLikeDislikeAnswerFail(state, action);

    default:
      return state;
  }
};

export default reducer;
