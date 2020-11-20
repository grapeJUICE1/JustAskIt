// const User = require('../models/userModel');
// const Post = require('../models/postModel');
const Answer = require('../models/answerModel');
const LikeDislike = require('../models/likeDislikeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterObj = require('../utils/filterObj');
const Post = require('../models/postModel');

exports.createAnswer = catchAsync(async (req, res, next) => {
  const newAnswer = await Answer.create({
    post: req.params.id,
    content: req.body.content,
    postedBy: req.user.id,
  });

  const postOfCreatedAnswer = await Post.findById(req.params.id);
  console.log(postOfCreatedAnswer.answerCount);
  postOfCreatedAnswer.answerCount = await Answer.countDocuments({
    post: req.params.id,
  });
  postOfCreatedAnswer.save();
  console.log(postOfCreatedAnswer.answerCount);
  res.status(201).json({
    status: 'success',
    data: {
      newAnswer,
    },
  });
});

exports.like = catchAsync(async (req, res, next) => {
  const checkIfLiked = await LikeDislike.findOne({
    type: 'like',
    for: 'Answer',
    doc: req.params.id,
    user: req.user.id,
  });
  console.log();
  if (checkIfLiked) {
    const post = await Answer.findById(checkIfLiked.doc.id);
    post.likeCount = post.likeCount > 0 ? (post.likeCount -= 1) : 0;
    await post.save();
    await LikeDislike.deleteMany({
      type: 'like',
      for: 'Answer',
      doc: req.params.id,
      user: req.user.id,
    });
    return res.status(204).json({
      status: 'success',
      data: {},
    });
  }
  const post = await LikeDislike.create({
    type: 'like',
    user: req.user.id,
    for: 'Answer',
    doc: req.params.id,
  });
  const sendPost = await LikeDislike.findById(post.id);
  res.status(200).json({
    status: 'success',
    data: {
      post: sendPost,
    },
  });
});
exports.dislike = catchAsync(async (req, res, next) => {
  const checkIfDisLiked = await LikeDislike.findOne({
    type: 'dislike',
    for: 'Answer',
    doc: req.params.id,
    user: req.user.id,
  });
  console.log();
  if (checkIfDisLiked) {
    const post = await Answer.findById(checkIfDisLiked.doc.id);
    post.dislikeCount = post.dislikeCount > 0 ? (post.dislikeCount -= 1) : 0;
    await post.save();
    await LikeDislike.deleteMany({
      type: 'dislike',
      for: 'Answer',
      doc: req.params.id,
      user: req.user.id,
    });
    return res.status(204).json({
      status: 'success',
      data: {},
    });
  }
  const post = await LikeDislike.create({
    type: 'dislike',
    user: req.user.id,
    for: 'Answer',
    doc: req.params.id,
  });
  const sendPost = await LikeDislike.findById(post.id);
  res.status(200).json({
    status: 'success',
    data: {
      post: sendPost,
    },
  });
});

exports.getAllAnswer = catchAsync(async (req, res, next) => {
  const posts = await Answer.find({});
  if (!posts)
    return next(
      new AppError(
        'Sorry no posts have been made yet.....start by creating a post',
        404
      )
    );
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});
exports.getAnswerOfPost = catchAsync(async (req, res, next) => {
  const posts = await Answer.find({ post: req.params.id });
  if (!posts)
    return next(
      new AppError('No Answers found for the post or post does not exist', 404)
    );
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getOneAnswer = catchAsync(async (req, res, next) => {
  const post = await Answer.findById(req.params.id);
  if (!post) return next(new AppError('No answer found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.deleteAnswersOfPost = catchAsync(async (req, res, next) => {
  await Answer.deleteMany({ post: req.params.id });
  next();
});

exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const post = await Answer.findById(req.params.id);
  if (!post) return next(new AppError('No answer found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this answer as this answer isn't yours",
        401
      )
    );
  await Answer.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});

exports.updateAnswer = catchAsync(async (req, res, next) => {
  const filteredReq = filterObj(req.body, 'content');
  const post = await Answer.findById(req.params.id);
  if (!post) return next(new AppError('No answer found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this answer as this answer isn't yours",
        401
      )
    );
  await Answer.findByIdAndUpdate(req.params.id, filteredReq);
  res.status(204).json({
    status: 'success',
  });
});

exports.getAnswersOfUser = catchAsync(async (req, res, next) => {
  const posts = await Answer.find({ postedBy: req.params.id });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});
