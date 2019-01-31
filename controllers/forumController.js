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
  var TopicPost = require('../models/ForumPost_model')
  
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
//              POST TOPIC IN GIVEN CATEGORY LIST
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
////                    GET POSTS LIST FOR TOPIC
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.getTopicForCategoryById = async function(req, res, next) {

  const topic_id = req.params.topic_id;

  try {
    var foundTopic = await ForumCategory.findById(topic_id);

    if (!foundTopic) {
      const error = new Error('Forum category not found');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    
    res.status(200).json({
      message: 'Topic with posts send!',
      foundTopic: foundTopic
    });
  } catch (error) {
    next(error);
  }

}


/////////////////////////////////////////////////////////////////////////////////////////////////
////                    ADD POST TO TOPIC
/////////////////////////////////////////////////////////////////////////////////////////////////


exports.addPostToTopic = async function(req, res, next) {

  const topic_id = req.body.topic_id;

  try {

    var newPost = new TopicPost({
      icon: req.body.icon,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.userData.userId,
      topic: topic_id
    });

    await newPost.save();

    await ForumCategory.update({
      _id: topic_id
    }, {
      $push: {
        posts: newPost._id
      }
    });

    var foundTopic = await ForumCategory.findById(topic_id);

    var allPosts = await TopicPost.find();

    res.status(200).json({
      message: 'Topic with posts send!',
      updatedTopic: foundTopic,
      postsList: allPosts
    });
  } catch (error) {
    next(error);
  }

}


/////////////////////////////////////////////////////////////////////////////////////////////////
////                    GET POST PREVIEW TO TOPIC LIST
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.getPostPreviewToTopicList = async function(req, res, next) {

  const topic_id = req.params.topic_id;

  try {

    var foundPosts = await TopicPost.find({ topic: topic_id});  

    res.status(200).json({
      message: 'Topic with posts send!',
      postsForTopic: foundPosts
    });
  } catch (error) {
    next(error);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    GET POST BY ID
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.getPostById = async function(req, res, next) {

  const post_id = req.params.post_id;

  try {

    var foundPost = await TopicPost.findById(post_id)
                     .populate({path: "author", select: "username _id imagePath"})
                     .populate({path: "topic", select: "title _id"});  

    res.status(200).json({
      message: 'post was send!',
      post: foundPost
    });
  } catch (error) {
    next(error);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    UPDATE POST
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.updatePost = async function(req, res, next) {

  const post_id = req.body._id;

  try {

    await TopicPost.findOneAndUpdate({_id: post_id, author: req.userData.userId },
      {
        _id: post_id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
      });

      var updatedPost = await TopicPost.findById(post_id);

    res.status(200).json({
      message: 'post was send!',
      updatedPost: updatedPost
    });
  } catch (error) {
    next(error);
  }

}

///////////////////////////////////////////////////////
//              DELETE POST BY ID
///////////////////////////////////////////////////////

exports.deletePostById = async function(req, res, next) {

  try {

    let postToBeDeleted = await TopicPost.findById(req.params.post_id);

    if(!postToBeDeleted) {
      const error = new Error('Post could not be found!');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    postToBeDeleted.remove();

    res.status(200).json({
      message: 'Forum deleted successfully!'
    });


  } catch(error) {
      next(error);
  }
}

