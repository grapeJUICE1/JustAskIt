const LikeDislike = require('../models/likeDislikeModel');
const handlerFactory = require('./handlerFactory');

exports.getLikeAndDislikesOfPostByUser = handlerFactory.getAll(
  LikeDislike,
  ['likeDislike'],
  {},
  'Post'
);
exports.getLikeAndDislikesOfAnswerByUser = handlerFactory.getAll(
  LikeDislike,
  ['likeDislike'],
  {},
  'Answer'
);
exports.getLikeAndDislikesOfCommentByUser = handlerFactory.getAll(
  LikeDislike,
  ['likeDislike'],
  {},
  'Comment'
);
