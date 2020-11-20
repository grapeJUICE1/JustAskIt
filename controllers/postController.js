const Post = require('../models/postModel');
const LikeDislike = require('../models/likeDislikeModel');
const Tag = require('../models/tagModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const filterObj = require('./../utils/filterObj');
const ApiFeatures = require('./../utils/ApiFeatures');

//controller to create new post
exports.createNewPost = catchAsync(async (req, res, next) => {
  //checks if tags accosiated with the post exist in the database
  //if it doesn't exists , save the tag and continue
  //if it doesn't , don't save the tag and continue
  const tags = req.body.tags.trim().split(' ');
  for (const tag of tags) {
    if (!(await Tag.findOne({ name: tag }))) {
      Tag.create({ name: tag });
    }
  }

  //creating new post
  const createdPost = await Post.create({
    title: req.body.title,
    content: req.body.content,
    postedBy: req.user.id,
    tags,
  });

  res.status(201).json({
    status: 'success',
    data: {
      createdPost,
    },
  });
});

//controller to get all posts
exports.getAllPost = catchAsync(async (req, res, next) => {
  let filter = {};
  //uses the apifeatures.js from util folder to implement
  //pagination , filtering , sorting and limiting
  const features = new ApiFeatures(Post.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;

  //sending error if no post was found
  if (!posts)
    return next(
      new AppError(
        'Sorry no posts have been made yet.....start by creating a post',
        404
      )
    );

  //sending total number of post in the database with the response
  const totalNumOfPost = await Post.countDocuments({});
  res.status(200).json({
    status: 'success',
    totalNumOfPost,
    results: posts.length,
    data: {
      posts,
    },
  });
});

//controller to get one post
exports.getOnePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  post.views += 1;
  post = await post.save();
  if (!post) return next(new AppError('No post found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

//controller to get post of user
exports.getPostOfUser = catchAsync(async (req, res, next) => {
  const filter = { postedBy: req.params.id };
  const features = new ApiFeatures(Post.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;
  if (!posts)
    return next(new AppError('The user has not posted any posts', 404));
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

//controller to like post
exports.like = catchAsync(async (req, res, next) => {
  //checking if user has liked the post ago or not
  const checkIfLiked = await LikeDislike.findOne({
    type: 'like',
    for: 'Post',
    doc: req.params.id,
    user: req.user.id,
  });
  const checkIfDisLiked = await LikeDislike.findOne({
    type: 'dislike',
    for: 'Post',
    doc: req.params.id,
    user: req.user.id,
  });

  //if user has liked the post earlier , unlike it
  if (checkIfLiked) {
    const post = await Post.findById(checkIfLiked.doc);
    await LikeDislike.deleteMany({
      type: 'like',
      for: 'Post',
      doc: req.params.id,
      user: req.user.id,
    });
    post.likeCount = await LikeDislike.countDocuments({
      type: 'like',
      for: 'Post',
      doc: req.params.id,
    });
    await post.save();
    return res.status(204).json({
      status: 'success',
      data: {},
    });
  }
  if (checkIfDisLiked) {
    console.log('lol 1');
    const post = await Post.findById(checkIfDisLiked.doc);
    await LikeDislike.deleteMany({
      type: 'dislike',
      for: 'Post',
      doc: req.params.id,
      user: req.user.id,
    });
    post.dislikeCount = await LikeDislike.countDocuments({
      type: 'dislike',
      for: 'Post',
      doc: req.params.id,
    });
    await post.save();
    console.log('lol 2');
  }
  //if user hasn't liked the post , let user like the post
  await LikeDislike.create({
    type: 'like',
    user: req.user.id,
    for: 'Post',
    doc: req.params.id,
  });
  console.log('lol 3');
  const post = await Post.findById(req.params.id);
  post.likeCount = await LikeDislike.countDocuments({
    type: 'like',
    for: 'Post',
    doc: req.params.id,
  });
  await post.save();
  res.status(200).json({
    status: 'success',
    data: {},
  });
});

//controller to dislike post
exports.dislike = catchAsync(async (req, res, next) => {
  //checking if user has disliked the post ago or not
  const checkIfDisLiked = await LikeDislike.findOne({
    type: 'dislike',
    for: 'Post',
    doc: req.params.id,
    user: req.user.id,
  });

  const checkIfLiked = await LikeDislike.findOne({
    type: 'like',
    for: 'Post',
    doc: req.params.id,
    user: req.user.id,
  });
  //if user has disliked the post earlier , redo it
  if (checkIfDisLiked) {
    const post = await Post.findById(checkIfDisLiked.doc);
    await LikeDislike.deleteMany({
      type: 'dislike',
      for: 'Post',
      doc: req.params.id,
      user: req.user.id,
    });
    post.dislikeCount = await LikeDislike.countDocuments({
      type: 'dislike',
      for: 'Post',
      doc: req.params.id,
    });
    await post.save();
    return res.status(204).json({
      status: 'success',
      data: {},
    });
  }
  if (checkIfLiked) {
    const post = await Post.findById(checkIfLiked.doc);
    await LikeDislike.deleteMany({
      type: 'like',
      for: 'Post',
      doc: req.params.id,
      user: req.user.id,
    });
    post.likeCount = await LikeDislike.countDocuments({
      type: 'like',
      for: 'Post',
      doc: req.params.id,
    });
    await post.save();
  }

  //if user hasn't liked the post , let user like the post
  await LikeDislike.create({
    type: 'dislike',
    user: req.user.id,
    for: 'Post',
    doc: req.params.id,
  });
  const post = await Post.findById(req.params.id);
  post.dislikeCount = await LikeDislike.countDocuments({
    type: 'dislike',
    for: 'Post',
    doc: req.params.id,
  });
  await post.save();
  res.status(200).json({
    status: 'success',
    data: {},
  });
});
exports.updatePost = catchAsync(async (req, res, next) => {
  const filteredReq = filterObj(req.body, 'title', 'content');
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this post as this post isn't yours",
        401
      )
    );
  await Post.findByIdAndUpdate(req.params.id, filteredReq);
  res.status(204).json({
    status: 'success',
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that id', 404));
  if (post.postedBy.id !== req.user.id)
    return next(
      new AppError(
        "You do not have permission to update this post as this post isn't yours",
        401
      )
    );
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});
