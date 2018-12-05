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


exports.getEvents = function (req, res) {

  Event.find()
    .then(events => {
      res.status(200).json({
        message: 'Fetched Posts',
        events: events
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    })
}

exports.addEvent = function (req, res) {

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
    .catch(err => {
      res.status(500).json({
        message: 'Creating Event Failed!'
      });
    });
}



exports.getEvent = function (req, res) {
  var event_id = req.params.event_id;
  Event.findById(event_id)
    .then(foundEvent => {
      if (!foundEvent) {
        res.status(404).json({
          message: "Can't find event by id"
        });
      }

      const creator = foundEvent.author;



      const user = User.findById(foundEvent.author)
        .then(foundUser => {

          res.status(200).json({
            message: "Found event by id",
            eventById: foundEvent,
            creatorName: foundUser.firstName + " " + foundUser.lastName
          })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Creating Event Failed!'
          });
        });

    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating Event Failed!'
      });
    });
}

exports.updateEvent = function (req, res) {
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

exports.deleteEvent = function (req, res) {

  const eventId = req.params.event_id;

  // const fetchedEvent = Event;

  Event.findById(eventId)
    .then(event => {

      if (!event) {
        res.status(404).json({
          message: 'Could not find event.'
        })
      }
      if (event.author.toString() !== req.userData.userId) {
        res.status(403).json({
          message: 'You are not authorized to do so.'
        })
      }

      // fetchedEvent = event;

      Comment.find({ event: eventId })
            .then(comment => {
              console.log(comment);

              for (var i = 0; i < comment.length; i++) {
                comment[i].remove()
              }
                });

            event.remove();

    })
    .then(delEvent => {
      res.status(200).json({
        message: "Deleted Event"
      });

    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting event failed!"
      });
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