var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');
var forumHandler = require('../controllers/forumController');
const authCheck = require('../middleware/check-auth');


const { body } = require('express-validator/check');
const User = require('../models/user_model');

/////////////////////////////////////////////////////////
///             MAIN FORUM SECTIONS
////////////////////////////////////////////////////////

router.get('/get_sections/', forumHandler.getForumList);

router.post('/add_section', authCheck, forumHandler.postForumInGivenCategoryList);

router.put('/update/:category_id', authCheck, forumHandler.updateForumInCategoryById);

router.delete('/deleteSection/:category_id', authCheck, forumHandler.deleteForumInCategoryById );

router.get('/get_topic_by_id/:topic_id', forumHandler.getTopicForCategoryById);

//////////////////////////////////////////////////////////////////////////////////////////////  get_posts_list
///                         POST INFORMATION
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_posts_list/:topic_id', forumHandler.getPostPreviewToTopicList);

router.post('/add_post', authCheck, forumHandler.addPostToTopic);












module.exports = router;