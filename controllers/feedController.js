'use strict';

var mongoose = require('mongoose');
var Post = mongoose.model('Posts',require('../models/post_model'));
var Users = mongoose.model('users',require('../models/user_model'));
var constants = require('../constants/messages');
var UserController = require('./userController');

/*
  Returns a collection of posts.
  Each post is injected with information about its author and authors of each comment.
*/
exports.list_latest_feed = function(req, res){
  var response = [];
  var limit = 100;  var postCounter = 0;
  Post.find().limit(limit).sort('postDate.getTime()').exec(function(err, posts){
    posts.forEach(function(post,postIndex){
      UserController.getUser(post.author_id).then(function(user){
        /*
        if(post.comments.length > 0){
          var commentCounter = 0;
          post.comments.forEach(function(comment,commentIndex){
            getUser(comment.author_id).then(function(user){
              post.comments[commentIndex].author = user;
              response[postIndex] = {post:post,user:user};
              if(++postCounter == posts.length){
                res.status(200).json(cleanArray(response));
              }
            },function(error){
                return res.status(500).json(constants.errors.badServer); //Does not work properly. Needs to break loop.
            })
          })
        }else{

        }
        */
          response[postIndex] = {post:post,user:user};
          if(++postCounter == posts.length){
            res.status(200).json(cleanArray(response));
          }
      },function(error){
        return res.status(500).json(constants.errors.badServer); //Does not work properly. Needs to break loop.
      })
    })
  });
};

/**
  Cleans the given array from empty elements.
  @return Array
*/
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
