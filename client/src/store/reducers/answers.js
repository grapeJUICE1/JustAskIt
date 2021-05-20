import updateObj from '../../shared/utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  answers: [],
  error: null,
  loading: false,

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
  // let answer = action.answer;
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === answer._id
  );
  answersCopy[updatedAnswerIndex].userDidLike = answer.userDidLike;
  answersCopy[updatedAnswerIndex].userDidDislike = answer.userDidDislike;
  answersCopy[updatedAnswerIndex].voteCount = answer.voteCount;
  answersCopy[updatedAnswerIndex].likeCount = answer.likeCount;
  answersCopy[updatedAnswerIndex].dislikeCount = answer.dislikeCount;

  return updateObj(state, {
    error: null,
    loading: false,
    answers: answersCopy,
  });
};
const likeAnswerFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const fetchCommentsStart = (state, action) => {
  return updateObj(state, {
    loadingComments: true,
    commentError: null,
  });
};
const fetchCommentsFail = (state, action) => {
  return updateObj(state, {
    commentError: action.error,
    loadingComments: false,
  });
};
const fetchCommentsSuccess = (state, action) => {
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.id
  );

  answersCopy[updatedAnswerIndex].comments = action.comments;

  return updateObj(state, {
    comments: action.comments,
    loadingComments: false,
    answers: answersCopy,
  });
};

const likeDislikeCommentStart = (state, action) => {
  return updateObj(state, {
    loadingComments: true,
    commentError: null,
  });
};
const likeDislikeCommentFail = (state, action) => {
  return updateObj(state, {
    commentError: action.error,
    loadingComments: false,
  });
};
const likeDislikeCommentSuccess = (state, action) => {
  let answersCopy = JSON.parse(JSON.stringify(state.answers));
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.comments.doc
  );

  let answersComments = answersCopy[updatedAnswerIndex].comments;
  let updatedAnswerCommentIndex = answersComments.findIndex(
    (obj) => obj._id === action.comments._id
  );

  answersComments[updatedAnswerCommentIndex] = action.comments;

  answersCopy[updatedAnswerIndex].comments = answersComments;

  return updateObj(state, {
    loadingComments: false,
    answers: answersCopy,
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

    case actionTypes.FETCH_ANSWER_COMMENTS_START:
      return fetchCommentsStart(state, action);
    case actionTypes.FETCH_ANSWER_COMMENTS_FAIL:
      return fetchCommentsFail(state, action);
    case actionTypes.FETCH_ANSWER_COMMENTS_SUCCESS:
      return fetchCommentsSuccess(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_START:
      return likeDislikeCommentStart(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_FAIL:
      return likeDislikeCommentFail(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_SUCCESS:
      return likeDislikeCommentSuccess(state, action);

    default:
      return state;
  }
};

export default reducer;
