'use strict';

var mongoose = require('mongoose');
var Post = mongoose.model('Posts',require('../models/post_model'));
var Users = mongoose.model('users',require('../models/user_model'));
var constants = require('../constants/messages');


exports.list_latest_feed = function(req, res){
  var response = [];
  var limit = 100;  var counter = 0;
  Post.find().limit(limit).sort('-postDate').exec(function(err, posts){
    posts.forEach(function(post,index){
      Users.findById(post.author_id,function(err,user){
        if(err) return res.status(500).json({error: constants.errors.badServer})
        if(user){
          response[index] ={post:post,user:user};
        }
        if(++counter == posts.length){
          res.status(200).json(cleanArray(response));
        }
      })
    })
  });
};

exports.loginRequired = function(req, res, next){
  if(req.user){
    next();
  }else{
    return res.status(401).json({ message: "Access Denied"});
  }
}

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
