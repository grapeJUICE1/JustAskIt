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
// const cloudinary = require('cloudinary-core');

const dUri = new DatauriParser();

const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

exports.getAllUsers = handlerFactory.getAll(
  User,
  ['totalNumOfData', 'nameSearch'],
  {},
  'User'
);
// catchAsync(async (req, res, next) => {
//   const users = await User.find({});

//   res.status(201).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.updateUserData = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'bio', 'links');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.uploadPhoto = catchAsync(async (req, res, next) => {
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

    res.status(200).json({
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

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
