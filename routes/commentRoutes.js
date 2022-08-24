const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.isAuthenticated,
    authController.restrictedTo('user'),
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.isAuthenticated,
    authController.checkCommentOwnership,
    commentController.updateComment
  )
  .delete(
    authController.isAuthenticated,
    authController.checkCommentOwnership,
    commentController.deleteComment
  );

module.exports = router;
