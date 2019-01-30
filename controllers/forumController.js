const {
    validationResult
  } = require('express-validator/check');
  var constants = require('../constants/messages');
  var htmlTemplates = require('../constants/htmlTemplateForEmail');
  const quotes = require('../constants/emailQuotesArray');
  var User = require('../models/user_model');
  var Event = require('../models/event_model');
  var Comment = require('../models/comment_model');
  var ForumCategory = require('../models/forum_category_model');
  
  var nodemailer = require('nodemailer');
  
  var transporter = nodemailer.createTransport({
    host: "smtp.google.com",
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

///////////////////////////////////////////////////////
//              GET CATEGORY LIST
///////////////////////////////////////////////////////

exports.getForumList = async function (req, res, next) {
    const queryCategoryName = req.query.categoryName;

    try {
        var forumCategory = await ForumCategory.find({forumCategory: queryCategoryName});
    
        if (!forumCategory) {
          const error = new Error('Forum category not found');
          error.statusCode = 404;
          error.data = errors.array();
          throw error;
        }
    
        
        res.status(200).json({
          message: 'List of forums for given category!',
          forumCategory: forumCategory
        });
      } catch (error) {
        next(error);
      }

}

///////////////////////////////////////////////////////
//              POST FORUM IN GIVEN CATEGORY LIST
///////////////////////////////////////////////////////

exports.postForumInGivenCategoryList = async function (req, res, next) {

    try {

        var forumCategory = new ForumCategory({
            icon: req.body.icon,
            title: req.body.title,
            description: req.body.description,
            forumCategory: req.body.forumCategory,
            forOwnersOnly: req.body.forOwnersOnly,
            author: req.userData.userId
        });

        await forumCategory.save();

        var updatedForumCategoryList = await ForumCategory.find({forumCategory: req.body.forumCategory});

        res.status(200).json({
        //   message: 'Forum category added for given category!',
          forumCategory: updatedForumCategoryList
        });
      } catch (error) {
        next(error);
      }

}

///////////////////////////////////////////////////////
//              UPDATE FORUM IN GIVEN CATEGORY LIST
///////////////////////////////////////////////////////

exports.updateForumInCategoryById = async function(req, res, next) {

    try {
        var result = await ForumCategory.updateOne({
            _id: req.body.id,
            author: req.userData.userId
        },{
            $set: {
                _id: req.body.id,
                icon: req.body.icon,
                title: req.body.title,
                description: req.body.description,
                forumCategory: req.body.forumCategory,
                forOwnersOnly: req.body.forOwnersOnly,
              }
        });

        var updatedForum = await ForumCategory.findById(req.body.id);

        if (result.n > 0) {
            res.status(201).json({
              message: 'Update successful!',
              updatedTopic: updatedForum
            });
          } else {
            const error = new Error('Not authorized!');
            error.statusCode = 401;
            throw error;
          }


    } catch(error) {
        next(error);
    }
}


///////////////////////////////////////////////////////
//              DELETE FORUM IN GIVEN CATEGORY LIST
///////////////////////////////////////////////////////

exports.deleteForumInCategoryById = async function(req, res, next) {

  try {

    console.log('ID');
    console.log(req.params.category_id);

    let forumToBeDeleted = await ForumCategory.findById(req.params.category_id);

    if(!forumToBeDeleted) {
      const error = new Error('Forum could not be found!');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    forumToBeDeleted.remove();

    res.status(200).json({
      message: 'Forum deleted successfully!'
    });


  } catch(error) {
      next(error);
  }
}



//////////////////////////////////////   *************  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    GET POSTS LIST FROM CATEGORY
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.getPostsForCategoryById = async function(req, res, next) {

  const category_id = req.params.category_id;

  try {
    var forumCategory = await ForumCategory.find({forumCategory: queryCategoryName});

    if (!forumCategory) {
      const error = new Error('Forum category not found');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    
    res.status(200).json({
      message: 'List of forums for given category!',
      forumCategory: forumCategory
    });
  } catch (error) {
    next(error);
  }

}