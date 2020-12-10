const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

//initializing express router
const router = express.Router();

//rouutes to do read operation on users
router.get('/get-all-users', userController.getAllUsers);
router.get('/:id', userController.getOneUser);

//route to login and signup
router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

//route for updating user data except password
router.patch(
  '/update-me',
  authController.protect,
  userController.updateUserData
);

//route for updating password
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
