var mongoose = require('mongoose');
const {
  validationResult
} = require('express-validator/check');
var UserController = require('./userController');
var constants = require('../constants/messages');
var async = require('async');
var User = require('../models/user_model');
var Event = require('../models/event_model');
var Comment = require('../models/comment_model');


exports.getEvents = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  Event.find()
    .then(events => {
      res.status(200).json({
        message: 'Fetched Posts',
        events: events
      })
    })
    .catch(error => {
      if (!error.statusCode) {
       error.statusCode = 500;
   }
   next(error);
   });
}

exports.addEvent = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const event = new Event({
    location: req.body.location,
    distance: req.body.distance,
    pace: req.body.pace,
    eventDate: req.body.eventDate,
    author: req.userData.userId
  });

  event.save()
    .then(createdEvent => {

      User.update({
        _id: req.userData.userId
      }, {
        $push: {
          createdEvent: createdEvent._id
        }
      }, result => {
        console.log(result);
      })

      res.status(201).json({
        message: "Event created",
        event: {
          ...createdEvent,
          id: createdEvent._id
        }
      });
    })
    .catch(error => {
      if (!error.statusCode) {
       error.statusCode = 500;
   }
   next(error);
   });
}



exports.getEvent = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  var event_id = req.params.event_id;
  Event.findById(event_id)
    .then(foundEvent => {
      if (!foundEvent) {
        const error = new Error("Can't find event by id");
        error.statusCode = 404;
        throw error;
      }

      const creator = foundEvent.author;



      const user = User.findById(foundEvent.author)
        .then(foundUser => {

          res.status(200).json({
            message: "Found event by id",
            eventById: foundEvent,
            creatorName: foundUser.firstName + " " + foundUser.lastName,
            creatorId: foundUser._id
          })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Creating Event Failed!'
          });
        });

    })
    .catch(error => {
      if (!error.statusCode) {
       error.statusCode = 500;
   }
   next(error);
   });
}

exports.updateEvent = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const event = new Event({
    _id: req.body.id,
    location: req.body.location,
    distance: req.body.distance,
    pace: req.body.pace,
    eventDate: req.body.eventDate,
    author: req.body.author
  })

  Event.updateOne({
      _id: req.body.id,
      author: req.userData.userId
    }, event)
    .then(result => {
      if (result.n > 0) {
        const error = new Error('Update successful!');
        error.statusCode = 201;
        throw error;
      } else {
        const error = new Error('Not authorized!');
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

exports.deleteEvent = function (req, res, next) {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const eventId = req.params.event_id;

  let fetchedEvent;

  return Event.findById(eventId)
    .then(event => {

      if (!event) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
      }
      if (event.author.toString() !== req.userData.userId) {
        const error = new Error('You are not authorized to do so.');
        error.statusCode = 401;
        throw error;
      } 

      fetchedEvent = event;

    })
    .then(nextstep => {
      Comment.find({ event: eventId })
            .then(comment => {
              console.log(comment);

              for (var i = 0; i < comment.length; i++) {
                comment[i].remove()
              }
                });

            fetchedEvent.remove();
    })
    .then(delEvent => {
     res.status(200).json({
        message: "Deleted Event"
      });

    })
    .catch(error => {
       if (!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
    });
}





// .then( result2 => {
//   Comment.find({event: event_id})
//   .then(commentsToBeRemoved => {

//     // console.log('commentsToBeRemoved');
//     // console.log(commentsToBeRemoved);

//     for(let i = 0; i < commentsToBeRemoved.length; i++ ) {
//           // console.log('commentToBeRemoved');
//           // console.log(commentsToBeRemoved[i]._id);
//       User.find({comment : commentsToBeRemoved[i]._id})
//       .then(userWithCommentId => {

//         // console.log('userWithCommentId');
//         // console.log(userWithCommentId[0]._id);

//         userWithCommentId[0].comment.pull(commentsToBeRemoved[i]._id)

//         userWithCommentId[0].save();
//       })
//     }

//     commentsToBeRemoved.save();
//   })
// }

// )