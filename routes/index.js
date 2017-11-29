var express = require('express');
var router = express.Router();
var feedController = require('../controllers/feedController');
var postController = require('../controllers/postController');
var authController = require('../controllers/authController');

/* GET home page. */
router.route('/')
  //.get(feedController.loginRequired, feedController.list_latest_feed) //protected
  .get(feedController.list_latest_feed) //not protected
router.route('/newpost')
  .post(authController.loginRequired, postController.createPost);
router.route('/newcomment')
  .post(authController.loginRequired, postController.addComment);
module.exports = router;
