const Post = require('../models/postModel');
const handlerFactory = require('./handlerFactory');

exports.createNewPost = handlerFactory.createOne(Post, [
  'title',
  'content',
  'postedBy',
  'tags',
]);
exports.getAllPost = handlerFactory.getAll(Post, ['totalNumOfData']);
exports.like = handlerFactory.likeDislike(Post, [], 'like', 'Post');
exports.dislike = handlerFactory.likeDislike(Post, [], 'dislike', 'Post');
exports.getOnePost = handlerFactory.getOne(Post, ['views']);
exports.getPostOfUser = handlerFactory.getAll(Post, [
  'usersDoc',
  'totalNumOfData',
]);
exports.deletePost = handlerFactory.deleteOne(Post);
exports.updatePost = handlerFactory.updateOne(Post, ['title', 'content']);
