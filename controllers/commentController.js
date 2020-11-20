const Comment = require('../models/commentModel');
const Answer = require('../models/answerModel');
const LikeDislike = require('../models/likeDislikeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterObj = require('../utils/filterObj');

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    postedBy: req.user.id,
    for: req.body.for,
    content: req.body.content,
    doc: req.params.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

exports.like = catchAsync(async (req, res, next) => {
  const checkIfLiked = await LikeDislike.findOne({
    type: 'like',
    for: 'Comment',
    doc: req.params.id,
    user: req.user.id,
  });
  console.log();
  if (checkIfLiked) {
    const post = await Comment.findById(checkIfLiked.doc.id);
    post.likeCount = post.likeCount > 0 ? (post.likeCount -= 1) : 0;
    await post.save();
    await LikeDislike.deleteMany({
      type: 'like',
      for: 'Comment',
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
    for: 'Comment',
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
    for: 'Comment',
    doc: req.params.id,
    user: req.user.id,
  });
  console.log();
  if (checkIfDisLiked) {
    const post = await Comment.findById(checkIfDisLiked.doc.id);
    post.dislikeCount = post.dislikeCount > 0 ? (post.dislikeCount -= 1) : 0;
    await post.save();
    await LikeDislike.deleteMany({
      type: 'dislike',
      for: 'Comment',
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
    for: 'Comment',
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

exports.getAllComments = catchAsync(async (req, res, next) => {
  const posts = await Comment.find({});
  if (!posts)
    return next(
      new AppError(
        'Sorry no comments have been made yet.....start by creating a comment',
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

exports.getCommentOfPost = catchAsync(async (req, res, next) => {
  const posts = await Comment.find({ for: 'Post', doc: req.params.id });
  if (!posts)
    return next(
      new AppError('No Comments found for the post or post does not exist', 404)
    );
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});
exports.getCommentOfAnswer = catchAsync(async (req, res, next) => {
  const posts = await Comment.find({ for: 'Answer', doc: req.params.id });
  if (!posts)
    return next(
      new AppError(
        'No Comments found for the answer or answer does not exist',
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

exports.getOneComment = catchAsync(async (req, res, next) => {
  const post = await Comment.findById(req.params.id);
  if (!post) return next(new AppError('No comment found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const post = await Comment.findById(req.params.id);
  if (!post) return next(new AppError('No comment found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this comment as this comment isn't yours",
        401
      )
    );
  await Comment.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const filteredReq = filterObj(req.body, 'content');
  const post = await Comment.findById(req.params.id);
  if (!post) return next(new AppError('No Comment found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this Comment as this Comment isn't yours",
        401
      )
    );
  await Comment.findByIdAndUpdate(req.params.id, filteredReq);
  res.status(204).json({
    status: 'success',
  });
});

exports.deleteCommentOfAnswer = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ for: 'Answer', doc: req.params.id });
  next();
});
exports.deleteCommentOfPost = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ for: 'Post', doc: req.params.id });
  next();
});
