var mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');
var constants = require('../constants/messages');
var User = require('../models/user_model');
var Event = require('../models/event_model');
var Comment = require('../models/comment_model');


exports.addCommentToEvent = function (req, res, next) {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const eventId = req.params.event_id;

    const comment = new Comment({
        content: req.body.content,
        author: req.userData.userId,
        event: eventId
    });

    console.log(req.body.content);


    comment.save()
        .then(createdComment => {

            User.findByIdAndUpdate(req.userData.userId, {
                    $push: {
                        "comment": createdComment._id
                    }
                })
                .then(user => {
                    user.save();
                });

            Event.findByIdAndUpdate(eventId, {
                    $push: {
                        "comments": createdComment._id
                    }
                })
                .then(event => {
                    event.save();
                });



            res.status(200).json({
                message: "Comment added",
                comment: createdComment
            });


        })
        .catch(error => {
            if (!error.statusCode) {
             error.statusCode = 500;
         }
         next(error);
         });
}

exports.getCommnentsForEvent = function (req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    Comment.find({
            event: req.params.event_id
        })
        .populate('author', 'username')
        .then(comments => {
            res.status(200).json({
                message: 'Fetched comments',
                comments: comments
            })
        })
        .catch(error => {
            if (!error.statusCode) {
             error.statusCode = 500;
         }
         next(error);
         });

}

exports.editComment = function (req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const eventId= req.params.event_id;
    const commentId = req.params.comment_id;
    const userId = req.userData.userId;

    console.log(eventId);
    console.log(commentId);
    console.log(userId);

    

    const updatedComment = {
        _id: commentId,
        content: req.body.content,
        event: eventId,
        author: userId
    }

    Comment.findByIdAndUpdate({
            _id: commentId,
            author: userId
        }, updatedComment)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Update successful!"
                });
            } else {
                const error = new Error("Not authorized!");
                error.statusCode = 401;
                throw error;
            }
        })
        .catch(error => {
            if (!error.statusCode) {
             error.statusCode = 500;
         }
         next(error);
         });
}


exports.DeleteEventComment = function (req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    
    const eventId = req.params.event_id;
    const commentId = req.params.comment_id;

    Comment.findById(commentId)
         .then(comment => {    
           if(!comment) {
            const error = new Error("Could not find comment.");
            error.statusCode = 404;
            throw error;
           }
           if(comment.author.toString() !== req.userData.userId) {
            const error = new Error("You are not authorized to do so.");
            error.statusCode = 403;
            throw error;
           }

             comment.remove();

         })
         .then(result => {
            res.status(200).json({message: "Deleted comment"});
         })
         .catch(error => {
            if (!error.statusCode) {
             error.statusCode = 500;
         }
         next(error);
         });
}
