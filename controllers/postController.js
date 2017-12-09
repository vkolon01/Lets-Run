'use_strict'

var mongoose = require('mongoose');
var Post = mongoose.model('Posts',require('../models/post_model'));
var AttachedEvent = mongoose.model("Events",require('../models/event_model'));
var constants = require('../constants/messages');

  /**
    Creates a post using the given form.
    The given jwt token is checked for validity before
    storing the post. If attachment is passed it is stored as well
    with its id stored in the related post
  */
exports.createPost = function(req,res){
  var newPost = req.body.post;
  newPost.author_id = req.user._id; //validate first
  var attachment = req.body.event;
  new Post(req.body.post)
    .save(function(err,post){
    if(err){
      console.log(err);
      res.send(err)
    }else{
      if(attachment){
        createEvent(attachment).then(function(newEvent){
          post.set({AttachedEvent: newEvent._id});
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
  console.log(req.body)
  var post_id = req.body.post_id;
  var author_id = req.user._id
  var comment = {
    author_id: author_id,
    body: req.body.comment.body
  }

  Post.findByIdAndUpdate(post_id,
    {$push:{comments: comment}},
    function(err,updatedPost){
      if(err) res.send(constants.errors.genericError);
      res.send(updatedPost);
    }
  )
}


function createEvent(attachment){
  return new Promise(function(fulfill,reject){
    something = new AttachedEvent(attachment)
    something.save(function(err,newEvent){
        if(err) reject(err);
        fulfill(newEvent);
    })
  });
}
