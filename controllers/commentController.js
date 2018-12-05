var mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');
var constants = require('../constants/messages');
var User = require('../models/user_model');
var Event = require('../models/event_model');
var Comment = require('../models/comment_model');


exports.addCommentToEvent = function (req, res) {

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
            res.status(500).json({
                message: "Commenting on event failed!"
            });
        });
}

exports.getCommnentsForEvent = function (req, res) {

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
            res.status(500).json({
                message: "Fetching comments failed!"
            });
        })

}

exports.editComment = function (req, res) {
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
                res.status(401).json({
                    message: "Not authorized!"
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't udpate event!"
            });
        });
}


exports.DeleteEventComment = function (req, res) {
    
    const eventId = req.params.event_id;
    const commentId = req.params.comment_id;

    Comment.findById(commentId)
         .then(comment => {    
           if(!comment) {
            res.status(404).json({message: 'Could not find comment.'})
           }
           if(comment.author.toString() !== req.userData.userId) {
            res.status(403).json({message: 'You are not authorized to do so.'})
           }

             comment.remove();

         })
         .then(result => {
            res.status(200).json({message: "Deleted comment"});
         })
         .catch(error => {
            res.status(500).json({
              message: "Deleting comment failed!"
            });
          });
}
