var express = require('express');
var router = express.Router();
var feedController = require('../controllers/feedController');
var postController = require('../controllers/postController');
var authController = require('../controllers/authController');

/* returns an array of all posts. */
router.route('/')
  .get(feedController.list_latest_feed)
router.route('/newpost')
  .post(authController.loginRequired, postController.createPost);
router.route('/newcomment')
  .post(authController.loginRequired, postController.addComment);
module.exports = router;
