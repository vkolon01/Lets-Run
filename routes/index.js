var express = require('express');
var router = express.Router();
var feedController = require('../controllers/feedController');
var postController = require('../controllers/postController');
var authController = require('../controllers/authController');

/* returns an array of all posts. */
router.get('/', feedController.list_latest_feed);
router.post('/newpost',authController.loginRequired, postController.createPost);
router.post('/newcomment', authController.loginRequired, postController.addComment);

module.exports = router;
