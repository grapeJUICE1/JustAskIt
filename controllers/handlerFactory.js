const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const filterObj = require('../utils/filterObj');
const Post = require('../models/postModel');
const LikeDislike = require('../models/likeDislikeModel');

exports.createOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    console.log(allowedFields, allowedFields.includes('postedBy'));
    if (allowedFields.includes('tags')) {
      req.body.tags = req.body.tags.trim().split(' ');
    }
    if (allowedFields.includes('post')) {
      req.body.post = req.params.id;
    }
    if (allowedFields.includes('doc')) {
      req.body.doc = req.params.id;
    }
    if (allowedFields.includes('postedBy')) {
      console.log('hahaha');
      req.body.postedBy = req.user.id;
    }
    const newDoc = await Model.create(req.body);

    if (allowedFields.includes('postOfCreatedAnswer')) {
      const postOfCreatedAnswer = await Post.findById(req.params.id);
      postOfCreatedAnswer.answerCount = await Model.countDocuments({
        post: req.params.id,
      });
      postOfCreatedAnswer.save();
    }
    console.log(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });
};

exports.getAll = (Model, allowedFields = [], filter = {}) => {
  return catchAsync(async (req, res, next) => {
    if (allowedFields.includes('usersDoc')) {
      filter.postedBy = req.params.id;
    }
    if (allowedFields.includes('postsDoc')) {
      filter.post = req.params.id;
    }
    if (allowedFields.includes('postsComments')) {
      filter.doc = req.params.id;
    }
    //uses the apifeatures.js from util folder to implement
    //pagination , filtering , sorting and limiting
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    //sending error if no post was found
    if (!docs)
      return next(
        new AppError(
          'Sorry no posts have been made yet.....start by creating a post',
          404
        )
      );

    //sending total number of post in the database with the response
    const totalNumOfData = allowedFields.includes('totalNumOfData')
      ? await Model.countDocuments({})
      : null;

    res.status(200).json({
      status: 'success',
      totalNumOfData: totalNumOfData || null,
      results: docs.length,
      data: {
        docs,
      },
    });
  });
};
exports.getOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);
    if (allowedFields.includes('views')) {
      doc.views += 1;
    }
    if (!doc) return next(new AppError('No doc found with that id', 404));
    doc = await doc.save();
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.likeDislike = (Model, allowedFields = [], type, forDoc) => {
  return catchAsync(async (req, res, next) => {
    //checking if user has liked the post ago or not
    const checkIfLiked = await LikeDislike.findOne({
      type: 'like',
      for: forDoc,
      doc: req.params.id,
      user: req.user.id,
    });
    const checkIfDisLiked = await LikeDislike.findOne({
      type: 'dislike',
      for: forDoc,
      doc: req.params.id,
      user: req.user.id,
    });

    //if user has liked the post earlier , unlike it
    if (checkIfLiked) {
      const doc = await Model.findById(checkIfLiked.doc);
      await LikeDislike.deleteMany({
        type: 'like',
        for: forDoc,
        doc: req.params.id,
        user: req.user.id,
      });
      doc.likeCount = await LikeDislike.countDocuments({
        type: 'like',
        for: forDoc,
        doc: req.params.id,
      });
      await doc.save();
      if (type === 'like') {
        return res.status(204).json({
          status: 'success',
          data: {},
        });
      }
    }
    if (checkIfDisLiked) {
      const doc = await Model.findById(checkIfDisLiked.doc);
      await LikeDislike.deleteMany({
        type: 'dislike',
        for: forDoc,
        doc: req.params.id,
        user: req.user.id,
      });
      doc.dislikeCount = await LikeDislike.countDocuments({
        type: 'dislike',
        for: forDoc,
        doc: req.params.id,
      });
      await doc.save();
      if (type === 'dislike') {
        return res.status(204).json({
          status: 'success',
          data: {},
        });
      }
    }
    //if user hasn't liked the post , let user like the post
    await LikeDislike.create({
      type: type,
      user: req.user.id,
      for: forDoc,
      doc: req.params.id,
    });

    const doc = await Model.findById(req.params.id);
    if (type === 'like') {
      doc.likeCount = await LikeDislike.countDocuments({
        type: type,
        for: forDoc,
        doc: req.params.id,
      });
    } else if (type === 'dislike') {
      doc.dislikeCount = await LikeDislike.countDocuments({
        type: type,
        for: forDoc,
        doc: req.params.id,
      });
    }
    await doc.save();
    res.status(204).json({
      status: 'success',
      data: {},
    });
  });
};

exports.deleteOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    const post = await Model.findById(req.params.id);
    if (!post) return next(new AppError('No document found with that id', 404));
    if (post.postedBy.id !== req.user.id)
      return next(
        new AppError(
          "You do not have permission to update this document as this document isn't yours",
          401
        )
      );
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  });
};

exports.updateOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    const filteredReq = filterObj(req.body, ...allowedFields);
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that id', 404));
    if (doc.postedBy.id !== req.user.id)
      return next(
        new AppError(
          "You do not have permission to update this document as this document isn't yours",
          401
        )
      );
    await Model.findByIdAndUpdate(req.params.id, filteredReq);
    res.status(204).json({
      status: 'success',
    });
  });
};
