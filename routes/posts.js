var express = require('express');
var router = express.Router();
var PostController = require('../controllers/postController');
var AuthController = require('../controllers/authController');

router.route('/:post_id')
  .get(PostController.getComments)
  .delete(AuthController.checkOwnership,PostController.deletePost)
  .put(AuthController.loginRequired,PostController.likePost);

  module.exports = router;
