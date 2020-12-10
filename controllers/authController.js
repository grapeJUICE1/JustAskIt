const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 401));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'hallelujah', {
    expires: new Date(Date.now() + 5),
  });
  res.status(204).json({
    status: 'success',
    data: {},
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  console.log('murgi', req.cookies);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    console.log('hello its me');
    token = req.cookies.jwt;
    console.log(token, req.cookies.jwt);
  }
  if (!token)
    return next(
      new AppError('You are not logged in..Please Log in to continue', 401)
    );
  console.log('success');
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentUser = await User.findById(decodedToken.id);
  console.log('success');
  if (!currentUser)
    return next(
      new AppError('User belonging to this token no longer exists', 401)
    );
  if (currentUser.checkIfPasswordChanged(decodedToken.iat))
    return next(
      new AppError(
        'You have currently changed password..Please log in again to continue',
        401
      )
    );
  console.log('nareul hudo');
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not permitted to perform this action'),
        401
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const currentUser = await User.findById(req.user.id).select('+password');
  console.log(currentUser);

  if (!currentUser)
    return next(
      new AppError('You are not logged in . Please Log in to get access', 401)
    );

  const { currentPassword, passwordNew, confirmPasswordNew } = req.body;
  console.log(currentPassword, passwordNew, confirmPasswordNew);
  if (!currentPassword || !passwordNew || !confirmPasswordNew)
    return next(
      new AppError(
        'Please provide your current password , your new password and confirmed new password',
        400
      )
    );
  console.log(
    await currentUser.comparePassword(currentPassword, currentUser.password)
  );
  if (
    !(await currentUser.comparePassword(currentPassword, currentUser.password))
  )
    return next(new AppError('Incorrect password', 401));

  currentUser.password = passwordNew;
  currentUser.passwordConfirm = confirmPasswordNew;

  await currentUser.save();

  createSendToken(currentUser, 200, res);
});
