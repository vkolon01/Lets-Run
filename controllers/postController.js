'use_strict'

var mongoose = require('mongoose');
var Post = mongoose.model('Posts',require('../models/post_model'));
var PostComment = mongoose.model('Comments',require('../models/comment_model'));
// var AttachedEvent = mongoose.model("Events",require('../models/event_model'));
var userController = require('./userController');
var constants = require('../constants/messages');
var async = require('async');

  /**
    Creates a post using the given form.
    The given jwt token is checked for validity before
    storing the post. If attachment is passed it is stored as well
    with its id stored in the related post
  */
exports.createPost = function(req,res){
  var newPost = req.body.post;
  var attachment = req.body.event;
  newPost.author_id = req.user._id; //validate first
  new Post(req.body.post)
    .save(function(err,post){
    if(err){
      res.send(err)
    }else{
      fieldName = 'createdPosts';
      userController.pushToUser(req.user._id,fieldName,post._id); //saves the created post's id in the authors record
      if(attachment){
        createEvent(attachment).then(function(newEvent){
          post.set({attachedEvent: newEvent._id});
          post.save(function(err,post){
            if(err) res.send(err);
            res.send(post);
          })
        })
      }else{
        res.send(post)
      }
    }
  })
}

exports.addComment = function(req,res){
  var message = req.body.comment.body;
  var post_id = req.body.post_id;
  var author_id = req.user._id;
  var comment = {
    author_id: author_id,
    message: message,
    parent_id: post_id
  }
  if(post_id){
    new PostComment(comment)
      .save(function(err,comment){
        if(err){
          res.send(err);
        }else{
          Post.findByIdAndUpdate(post_id,
            {$push:{comments: comment._id}},
            function(err,updatedPost){
              if(err) {
                res.status(500).send(constants.errors.genericError);
              }
              res.status(200).json(constants.success.commentPosted);
            }
          )
        }
      })
  }else{
      res.status(500).send(constants.errors.genericError);
  }
}

exports.getComments = function(req,res){
  var post_id = req.params.post_id;
  var response = [];
  PostComment.find({parent_id: post_id},function(err,comments){
    if(err) res.send(constants.errors.genericError);
    async.forEach(comments,function(comment,callback){
      userController.getUser(comment.author_id).then(function(user){
        comment.author = user;
        response.push(comment);
        callback()
      },function(err){
        callback(err);
      })
    },function(err){
      if(err) res.status(500).send(err);
      res.send(response);
    })
  })
}

exports.likePost = function(req,res){
  var post_id = req.params.post_id;
  var user_id = req.user._id;
  Post.findById(post_id,function(err,post){
    if(err){
      res.status(500).send(constants.errors.genericError)
    }else if(post && post.likes){
      if(!post.likes.includes(user_id)){
        post.likes.push(user_id);
        post.save(function(err){
          if(err) res.status(500).send(constants.errors.genericError);
        })
        res.send(constants.success.postLiked);
      }else{
        post.likes.splice(post.likes.indexOf(user_id),1);
        post.save(function(err){
          if(err) res.status(500).send(constants.errors.genericError);
        })
        res.send(constants.success.postDisliked);
      }
    }else{
      res.status(500).send(constants.errors.genericError);
    }
  })
}

exports.deletePost = function(req,res){
  var post_id = req.params.post_id;
  deletePost(post_id).then(function(message){
    res.send(message);
  },function(err){
    res.status(500).send(err);
  })
}

exports.getEvent = function(event_id){
  return new Promise(function(fulfill,reject){
    AttachedEvent.findById(event_id,function(err,event){
      if(err) reject(err)
      fulfill(event);
    })
  })
}

/*
  Removes a post document with the given id.
  Once the post is deleted, all the associate comments
  are also removed.
*/
function deletePost(post_id){
  return new Promise(function(fulfill, reject){
    Post.findById(post_id,function(err,post){
      if(err){
        reject(err)
      }else if(post){
        PostComment.remove({parent_id: post_id},function(err){});
        console.log(post.attachedEvent)
        if(post.attachedEvent){
          AttachedEvent.remove({_id: post.attachedEvent},function(err){});
        }
        post.remove()
        fulfill(constants.success.postDeleted)
      }
    })
  })
}

function deleteComment(comment_id){
  return new Promise(function(fulfill,reject){
    PostComment.findById(comment_id).remove(function(err){
      if(err) reject(err)
      fulfill(constants.success.commentDeleted)
    })
  })
}

function createEvent(attachment){
  return new Promise(function(fulfill,reject){
    console.log(attachment)
    something = new AttachedEvent(attachment)
    something.save(function(err,newEvent){
        if(err) reject(err);
        fulfill(newEvent);
    })
  });
}
