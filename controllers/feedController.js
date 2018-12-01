'use strict';

var mongoose = require('mongoose');
var Post = mongoose.model('Posts',require('../models/post_model'));
// var Users = mongoose.model('users',require('../models/user_model'));
var constants = require('../constants/messages');
var UserController = require('./userController');
var PostController = require('./postController');
var async = require('async');

/*
  Returns a collection of posts.
  Each post is injected with information about its author and authors of each comment.
*/
exports.list_latest_feed = function(req, res){
//   var limit = 100;
  
//   Post.find().limit(limit).sort('postDate.getTime()').exec(function(err, posts){
//   // console.log("HEADERS: " + res.headers);

//     assemblePosts(posts).then(function(result){
//       res.send(result)
//     },function(err){
//       res.status(500).json(constants.errors.badServer)
//     })
//   });
};

exports.getPostsById = function(req,res){
  // Users.findById(req.params.user_id,function(err,user){
  //   if(err) res.status(404).json({message: constants.errors.userNotFound});
  //   if(user){
  //     Post.find({'_id': { $in: user.createdPosts}
  //     },function(err, posts){
  //       assemblePosts(posts).then(function(result){
  //         res.send(result)
  //       },function(err){
  //         res.status(500).json(constants.errors.badServer)
  //       })
  //     })
  //   }
  // })
}

/**
  Cleans the given array from empty elements.
  // @return Array
*/
// function cleanArray(actual) {
//   var newArray = new Array();
//   for (var i = 0; i < actual.length; i++) {
//     if (actual[i]) {
//       newArray.push(actual[i]);
//     }
//   }
//   return newArray;
// }

// function assemblePosts(posts){
//   return new Promise(function(fulfill,reject){
//     var response = [];
//     async.forEach(posts,function(post,callback){
//       async.parallel({
//         user: function(nestedCallback){
//           UserController.getUser(post.author_id).then(function(user){
//             nestedCallback(null,user)
//           }),
//           function(err){
//             nestedCallback(err)
//           }
//         },
//         attachment: function(nestedCallback){
//           if(post.attachedEvent){
//             PostController.getEvent(post.attachedEvent).then(function(event){
//               nestedCallback(null,event)
//             },function(err){nestedCallback(err)})
//           }else{
//             nestedCallback();
//           }
//         }
//       },function(err,result){
//         if(err) callback(err) //handle errors
//         response.push({post:post,user:result.user,event:result.attachment});
//         callback()
//       })
//     },function(err){
//       if(err) reject(err)
//       fulfill(response);
//     })
//   })
// }
