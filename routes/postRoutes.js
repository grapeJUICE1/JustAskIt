const express = require('express');

const authController = require('./../controllers/authController');
const answerController = require('./../controllers/answerController');
const postController = require('./../controllers/postController');
const tagController = require('./../controllers/tagController');
const commentController = require('./../controllers/commentController');

//initializing express router
const router = express.Router();

//route to create post
router.post(
  '/create-post',
  authController.protect,
  postController.createNewPost
);

//route to get , update and delete single post
router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(authController.protect, postController.updatePost)
  .delete(
    authController.protect,
    answerController.deleteAnswersOfPost,
    commentController.deleteCommentOfPost,
    postController.deletePost
  );

//route to like and dislike post
router.route('/:id/like').post(authController.protect, postController.like);
router
  .route('/:id/dislike')
  .post(authController.protect, postController.dislike);

//route to do read operations on posts
router.route('/:id/get-posts-of-user').get(postController.getPostOfUser);
router.route('/').get(postController.getAllPost);
router.get('/getPostsForTag/:tagName', tagController.getPostOfTag);

module.exports = router;
