const {
    validationResult
  } = require('express-validator/check');
  var constants = require('../constants/messages');
  var htmlTemplates = require('../constants/htmlTemplateForEmail');
  const quotes = require('../constants/emailQuotesArray');
  var User = require('../models/user_model');
  var Event = require('../models/event_model');
  var Comment = require('../models/comment_model');
  var Topic = require('../models/Topic_model');
  var TopicPost = require('../models/Post_model')
  var PostComment = require('../models/Post_comment_module');
  
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
        var forumCategory = await Topic.find({forumCategory: queryCategoryName});
    
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

      if(req.userData.userRole !== 'admin') {
        const error = new Error('You are not allowed, sorry');
        error.statusCode = 401;
        // error.data = error.array();
        throw error;
      }
      

        var forumCategory = new Topic({
            icon: req.body.icon,
            title: req.body.title,
            description: req.body.description,
            forumCategory: req.body.forumCategory,
            forOwnersOnly: req.body.forOwnersOnly,
            author: req.userData.userId
        });

        await forumCategory.save();

        var updatedTopicList = await Topic.find({forumCategory: req.body.forumCategory});

        res.status(200).json({
        //   message: 'Forum category added for given category!',
          forumCategory: updatedTopicList
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


      if(req.userData.userRole !== 'admin') {
        const error = new Error('You are not allowed, sorry');
        error.statusCode = 401;
        // error.data = error.array();
        throw error;
      }

        var result = await Topic.updateOne({
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

        var updatedForum = await Topic.findById(req.body.id);

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

    if(req.userData.userRole !== 'admin') {
      const error = new Error('You are not allowed, sorry');
      error.statusCode = 401;
      // error.data = error.array();
      throw error;
    }

    let forumToBeDeleted = await Topic.findById(req.params.category_id);

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

  const errors = validationResult(req);

  const topic_id = req.params.topic_id;

  try {
    var foundTopic = await Topic.findById(topic_id);

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

    const topic = await Topic.findById(topic_id);

    if(topic.forOwnersOnly = true &&  req.userData.userRole !== 'admin') {
      const error = new Error('You are not allowed, sorry');
      error.statusCode = 401;
      // error.data = error.array();
      throw error;
    }


    var newPost = new TopicPost({
      icon: req.body.icon,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.userData.userId,
      topic: topic_id
    });

    await newPost.save();

    await Topic.update({
      _id: topic_id
    }, {
      $push: {
        posts: newPost._id
      }
    });

    await User.update({
      _id: req.userData.userId
    }, {
      $push: {
        createdPosts: newPost._id
      }
    })

    var foundTopic = await Topic.findById(topic_id);

    var allPosts = await TopicPost.find({topic: topic_id}).sort({createdAt: -1});

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

  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const topic_id = req.params.topic_id;

  try {

    var foundPosts = await TopicPost.find({ topic: topic_id}).sort({createdAt: -1}).skip(pageSize * (currentPage - 1));  

    var countPost = await TopicPost.find({ topic: topic_id}).countDocuments();

    res.status(200).json({
      message: 'Topic with posts send!',
      postsForTopic: foundPosts,
      totalPosts: countPost
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

  const errors = validationResult(req);

  try {

    let postToBeDeleted = await TopicPost.findOne({_id: req.params.post_id, author: req.userData.userId});

    if(!postToBeDeleted) {
      const error = new Error('Post could not be found!');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    await postToBeDeleted.remove();

    var commentToDelete = await PostComment.find({forumPost: req.params.post_id});

    await commentToDelete.forEach(comment => {
      comment.remove();
    });

    res.status(200).json({
      message: 'Forum deleted successfully!'
    });


  } catch(error) {
      next(error);
  }
}


/////////////////////  ** COMMENT FOR POST ** \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////////////////////////////////////////////////////////////////////////////
////                    GET COMMENT BY POST_ID
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.getCommentsByPostId = async function(req, res, next) {

  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const post_id = req.params.post_id;

  try {

    var foundComment = await PostComment.find({forumPost: post_id}).sort({createdAt: -1}).skip(pageSize * (currentPage - 1)).limit(pageSize).populate({path: "author", select: "username"});
// .skip(pageSize * (currentPage - 1)).limit(pageSize)
    var commentsCount = await PostComment.find({forumPost: post_id}).countDocuments();
    res.status(200).json({
      message: 'post was send!',
      comments: foundComment,
      commentsCount: commentsCount
    });
  } catch (error) {
    next(error);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    ADD COMMENT TO POST BY POST_ID
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.addCommentToPost = async function(req, res, next) {

  const post_id = req.params.post_id;

  try {

    var newComment = new PostComment({
      content: req.body.content,
      author: req.userData.userId,
      forumPost: post_id
    });

    await newComment.save();

    const user = await User.findById(req.userData.userId);
    const  username = user.username;

    await TopicPost.update({
      _id: post_id
    }, {
      $push: {
        postComments: newComment._id
      },
      $set: {
        lastComment: {
          username: username,
          date: newComment.createdAt
        }
      }
    });

    const post = await TopicPost.findById(post_id);
    const postInfo = {
           name: post.title,
           id: post._id
          }

    const topicToUpdate = await Topic.update({
      posts: post_id
    }, {
      $set: {
        lastComment: {
          post: {
            postName: postInfo.name,
            postId: postInfo.id
          },
          userName: username,
          date: newComment.createdAt
        }
      }
    });

    
  

    var allComments = await PostComment.find({forumPost: post_id});

    res.status(200).json({
      message: 'Topic with posts send!',
      comments: allComments
    });
  } catch (error) {
    next(error);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    UPDATE COMMENT TO POST
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.updateCommentToPost = async function(req, res, next) {

  const comment_id = req.body.comment_id;

  try {

    await PostComment.findOneAndUpdate({_id: comment_id, author: req.userData.userId },
      {
        _id: comment_id,
        content: req.body.content
      });

      var updatedComment = await PostComment.findById(comment_id);

    res.status(200).json({
      message: 'post was send!',
      comment: updatedComment
    });
  } catch (error) {
    next(error);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    REPLY TO COMMENT IN POST
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.replyToCommentInPost = async function(req, res, next) {

  const comment_id = req.body.comment_id;
  const post_id = req.params.post_id;

  try {

    const commentToQuote = await PostComment.findById(comment_id);

    const quoteContent = commentToQuote.content;

    const authorOfQuote = await User.findById(commentToQuote.author._id);

    const quoteAuthor = authorOfQuote.username;

    // console.log('authorOfQuote.username');
    // console.log(authorOfQuote.username);

    var newComment = new PostComment({
      content: req.body.content,
      author: req.userData.userId,
      quote: {
        content: quoteContent,
        quoteAuthor: quoteAuthor
      },
      forumPost: post_id
    });

    await newComment.save();

    await TopicPost.update({
      _id: post_id
    }, {
      $push: {
        postComments: newComment._id
      }
    });

    var allComments = await PostComment.find({forumPost: post_id});

    res.status(200).json({
      message: 'post was send!',
      comments: allComments
    });
  } catch (error) {
    next(error);
  }

}

///////////////////////////////////////////////////////
//              DELETE COMMENT BY ID
///////////////////////////////////////////////////////

exports.deleteCommentById = async function(req, res, next) {

  const errors = validationResult(req);

  try {

    let commentToBeDeleted = await PostComment.findOne({_id: req.params.comment_id, author: req.userData.userId});

    if(!commentToBeDeleted) {
      const error = new Error('Post could not be found!');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    await commentToBeDeleted.remove();

    res.status(200).json({
      message: 'Comment deleted successfully!'
    });


  } catch(error) {
      next(error);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////                    REPORT COMMENT TO POST
/////////////////////////////////////////////////////////////////////////////////////////////////

exports.reportCommentById = async function(req, res, next) {


  try {

    const commentId = req.params.comment_id;

    console.log('commentId');
    console.log(commentId);
    

    await PostComment.findOneAndUpdate({_id: commentId},
      {
        _id: commentId,
        reported: {
          status: true,
          reporter: req.userData.userId,
          dateOfReport: Date.now()
        }
      });

      console.log(await PostComment.findById(commentId));
      

    res.status(200).json({
      message: 'Comment reported!'
    });


  } catch(error) {
      next(error);
  }
}

///////////////////////////////////////////////////////
//              GET FORUM TOPICS FOR HOME COMPONENT
///////////////////////////////////////////////////////

exports.getForumInformationForHomeComponent = async function(req, res, next) {
  console.log("HOme component");
  try {

    let currentDate = Date.now();

    let modDate = new Date(currentDate).setDate(new Date(currentDate).getDate() - 1);
    var isoCurrentDate = new Date(modDate).toISOString();

    const topics = await Topic.countDocuments();

    const posts = await TopicPost.countDocuments();

    const comments = await PostComment.countDocuments();

    // const futureEvents = await Event.countDocuments({
    //   eventDate: {
    //     $gt: isoCurrentDate
    //   }
    // }).countDocuments();
    console.log('topics');
    console.log(topics);

    console.log('posts');
    console.log(posts);

    console.log('comments');
    console.log(comments);
    

        res.status(201).json({
          message: 'events found',
          topics: topics,
          posts: posts,
          comments: comments
        });

  } catch(error) {
      next(error);
  }
}