const Answer = require('../models/answerModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.createAnswer = handlerFactory.createOne(Answer, [
  'post',
  'content',
  'postedBy',
  'postOfCreatedAnswer',
]);
exports.like = handlerFactory.likeDislike(Answer, [], 'like', 'Answer');
exports.dislike = handlerFactory.likeDislike(Answer, [], 'dislike', 'Answer');
exports.getAllAnswer = handlerFactory.getAll(Answer, ['totalNumOfData']);
exports.getOneAnswer = handlerFactory.getOne(Answer);
exports.getAnswerOfPost = handlerFactory.getAll(Answer, ['postsDoc']);
exports.getAnswersOfUser = handlerFactory.getAll(Answer, ['usersDoc']);
exports.deleteAnswer = handlerFactory.deleteOne(Answer, [
  'postOfCreatedAnswer',
]);
exports.updateAnswer = handlerFactory.updateOne(Answer, ['content']);

exports.deleteAnswersOfPost = catchAsync(async (req, res, next) => {
  await Answer.deleteMany({ post: req.params.id });
  next();
});
