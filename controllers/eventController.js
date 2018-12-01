var mongoose = require('mongoose');
const {
  validationResult
} = require('express-validator/check');

// var AttachedEvent = mongoose.model("Events",require('../models/event_model'));
var UserController = require('./userController');
var constants = require('../constants/messages');
var async = require('async');
var User = require('../models/user_model');
var Event = require('../models/event_model')


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
      if(!foundEvent){
        res.status(404).json({
          message: "Can't find event by id"
        });
      }

      const creator = foundEvent.author;
      // console.log('creator');
      // console.log(creator);
        const user = User.findById(foundEvent.author)
            .then(foundUser => {

              // console.log('user');
              // console.log(foundUser);
      

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

exports.updateEvent = function(req, res) {
  const event = new Event({
    _id: req.body.id,
    location: req.body.location,
    distance: req.body.distance,
    pace: req.body.pace,
    eventDate: req.body.eventDate,
    author: req.body.author
  })

  Event.updateOne({_id: req.body.id, author: req.userData.userId}, event)
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
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
  Event.findById(eventId)
       .then(event => {
        console.log('event');

         console.log(event);
         
         if(!event) {
          res.status(404).json({message: 'Could not find event.'})
         }
         if(event.author.toString() !== req.userData.userId) {
          res.status(403).json({message: 'You are not authorized to do so.'})
         }

         Event.findByIdAndRemove(eventId)
              .then(result => {
                console.log('result');

                console.log(result);
                
                User.findById(req.userData.userId)
                .then(user => {
                  user.createdEvent.pull(eventId);
                    user.save()
                });
              });

              res.status(200).json({message: "Deleted Event"});
              
       })
       .catch(error => {
          res.status(500).json({
            message: "Deleting event failed!"
          });
        });
  // Event.deleteOne({ _id: req.params.event_id, author: req.userData.userId })
  // .then(result => {
  //   console.log(result);
    
  //   if (result.n > 0) {
  //     res.status(200).json({ message: "Deletion successful!" });
  //   } else {
  //     res.status(401).json({ message: "Not authorized!" });
  //   }
    
  // })
  // .catch(error => {
  //   res.status(500).json({
  //     message: "Deleting event failed!"
  //   });
  // });
}