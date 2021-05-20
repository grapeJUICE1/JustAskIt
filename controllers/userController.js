const User = require('../models/userModel');
const Post = require('../models/postModel');
const Answer = require('../models/answerModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const DatauriParser = require('datauri/parser');
const path = require('path');
const handlerFactory = require('./handlerFactory');
const { uploader, cloudinaryConfig } = require('../cloudinaryConfig');

const dUri = new DatauriParser();

const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

exports.getAllUsers = handlerFactory.getAll(
  User,
  ['totalNumOfData', 'nameSearch'],
  {},
  'User'
);

exports.updateUserData = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, [
    'name',
    'email',
    'bio',
    'location',
    'workStatus',
    'links',
  ]);
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.uploadPostPhoto = catchAsync(async (req, res, next) => {
  if (req.file) {
    const file = dataUri(req).content;

    const result = await uploader.upload(file);
    console.log(result);
    const url = result.url;

    return res.status(200).json({
      status: 'success',
      data: {
        url,
      },
    });
  } else {
    next(new AppError('upload a photo first', 400));
  }
});
exports.uploadPhoto = catchAsync(async (req, res, next) => {
  console.log('jjjjjjjjj');
  let photo = req.user.photo;
  if (req.file) {
    const file = dataUri(req).content;

    const result = await uploader.upload(file);
    console.log(result.public_id);

    photo = result.public_id;

    console.log(photo);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { photo },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } else {
    next(new AppError('upload a photo first', 400));
  }
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
