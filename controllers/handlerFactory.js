const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const filterObj = require('../utils/filterObj');
const Post = require('../models/postModel');
const Tag = require('../models/tagModel');
const LikeDislike = require('../models/likeDislikeModel');
const tagValidation = require('../utils/tagValidation');

exports.createOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    req.body = filterObj(req.body, allowedFields);

    if (allowedFields.includes('post')) {
      req.body.post = req.params.id;
    }
    if (allowedFields.includes('doc')) {
      req.body.doc = req.params.id;
    }
    if (allowedFields.includes('postedBy')) {
      req.body.postedBy = req.user.id;
    }

    const newDoc = await Model.create(req.body);

    return res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc,
      },
    });
  });
};

exports.getAll = (Model, allowedFields = [], filter = {}, forModel = null) => {
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
    if (allowedFields.includes('nameSearch')) {
      filter.name = {
        $regex: req.query.search,
        $options: 'i',
      };
    }
    if (allowedFields.includes('titleSearch')) {
      filter.title = {
        $regex: req.query.search || '',
        $options: 'i',
      };
    }
    if (allowedFields.includes('tagSearch')) {
      filter.name = {
        $regex: req.query.search || '',
        $options: 'i',
      };
    }

    if (allowedFields.includes('likeDislike')) {
      filter.for = forModel;
      filter.doc = req.params.id;
      filter.user = req.user.id;

      const doc = await Model.findOne(filter);
      return res.status(200).json({
        status: 'success',
        data: {
          doc,
        },
      });
    }
    //uses the apifeatures.js from util folder to implement
    //pagination , filtering , sorting and limiting

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let docs = await features.query;
    //sending error if no post was found
    if (!docs)
      return next(
        new AppError(
          'Sorry no posts have been made yet.....start by creating a post',
          404
        )
      );

    //sending total number of post in the database with the response
    let totalNumOfData = allowedFields.includes('totalNumOfData')
      ? await new ApiFeatures(Model.countDocuments(filter), req.query).filter(
          true
        ).query
      : null;

    return res.status(200).json({
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
    if (!doc) return next(new AppError('No doc found with that id', 404));

    if (allowedFields.includes('views')) {
      doc.views += 1;
    }
    doc = await doc.save();
    return res.status(200).json({
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
      doc.voteCount = doc.likeCount - doc.dislikeCount;
      doc.userDidLike = false;
      doc.userDidDisLike = false;
      await doc.save();
      if (type === 'like') {
        return res.status(200).json({
          status: 'success',
          data: { doc },
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
      doc.voteCount = doc.likeCount - doc.dislikeCount;
      doc.userDidLike = false;
      doc.userDidDisLike = false;
      await doc.save();
      if (type === 'dislike') {
        return res.status(200).json({
          status: 'success',
          data: { doc },
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
      doc.userDidLike = true;
      doc.userDidDisLike = false;
    } else if (type === 'dislike') {
      doc.dislikeCount = await LikeDislike.countDocuments({
        type: type,
        for: forDoc,
        doc: req.params.id,
      });
      doc.userDidDislike = true;
      doc.userDidLike = false;
    }
    doc.voteCount = doc.likeCount - doc.dislikeCount;
    await doc.save();
    return res.status(200).json({
      status: 'success',
      data: { doc },
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
    return res.status(204).json({
      status: 'success',
    });
  });
};

exports.updateOne = (Model, allowedFields = []) => {
  return catchAsync(async (req, res, next) => {
    const filteredReq = filterObj(req.body, allowedFields);

    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that id', 404));
    if (doc.postedBy.id !== req.user.id)
      return next(
        new AppError(
          "You do not have permission to update this document as this document isn't yours",
          401
        )
      );
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      filteredReq,
      { new: true, runValidators: true }
    );
    if (updatedDoc.tags) {
      // TODO:
      tagValidation(updatedDoc.tags, next, Post);
    }
    return res.status(200).json({
      status: 'success',
      data: { doc: updatedDoc },
    });
  });
};
exports.addVarToMiddleware = (variable) => {
  return catchAsync(async (req, res, next) => {
    req.variable = variable;
    next();
  });
};
