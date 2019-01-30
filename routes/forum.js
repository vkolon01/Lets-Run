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


//////////////////////////////////////////////////////////////////////////////////////////////
///     MAIN POSTS SECTION WITH LITTLE INFORMATION FOR CERTAIN CATEGORY OF FORUM
//////////////////////////////////////////////////////////////////////////////////////////////


router.get('/get_posts/:category_id')









module.exports = router;