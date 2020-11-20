const User = require('../models/userModel');
const Post = require('../models/postModel');
const Answer = require('../models/answerModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  res.status(201).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email');
  // if (req.file) filteredBody.photo = req.file.filename;
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

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
