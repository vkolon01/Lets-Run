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


////////////////////////////////////////////////////////////////////////////////////////////// 
///                         POST INFORMATION
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_posts_list/:topic_id', forumHandler.getPostPreviewToTopicList);

router.get('/get_post/:post_id', forumHandler.getPostById);

router.post('/add_post', authCheck, forumHandler.addPostToTopic); 

router.delete('/delete_post/:post_id', authCheck, forumHandler.deletePostById );

router.put('/updatePost', authCheck, forumHandler.updatePost);

////////////////////////////////////////////////////////////////////////////////////////////// 
///                         POST COMMENT INFORMATION
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_comment_to_post/:post_id', forumHandler.getCommentsByPostId);

router.post('/add_comment/:post_id', authCheck, forumHandler.addCommentToPost); 

router.put('/update_comment_to_post', authCheck, forumHandler.updateCommentToPost);

router.put('/reply_to_comment/:post_id', authCheck, forumHandler.replyToCommentInPost);

router.delete('/delete_comment_to_post/:comment_id', authCheck,  forumHandler.deleteCommentById);

////////////////////////////////////////////////////////////////////////////////////////////// 
///                         HOME COMPONENT INFORMATION
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_forum_information_for_home_component', forumHandler.getForumInformationForHomeComponent);




module.exports = router;