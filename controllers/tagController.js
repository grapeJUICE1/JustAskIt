const Post = require('../models/postModel');
const Tag = require('../models/tagModel');
const ApiFeatures = require('./../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getPostOfTag = catchAsync(async (req, res, next) => {
  const filterTags = req.params.tagName.split('-');
  let filter = {
    tags: {
      $elemMatch: { $in: filterTags },
    },
  };
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
