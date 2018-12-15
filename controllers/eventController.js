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

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const eventQuery = Event.find(); 
  let fetchedEvent;

  if (pageSize && currentPage) {
    eventQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  eventQuery
    .then(events => {
      
       fetchedEvent = events.map(event => {
        return {
          _id: event._id,
          location: event.location,
          picture: event.picture,
          author: event.author,
          likes: event.likes,
          runners: event.runners
        }
      })
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Fetched Posts',
        events: fetchedEvent,
        maxEvents: count
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
}

exports.addEvent = function (req, res, next) {

  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  } 


  const event = new Event({
    location: req.body.location,
    distance: req.body.distance,
    pace: req.body.pace,
    eventDate: req.body.eventDate,
    author: req.userData.userId,
    picture : imagePath
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
            message: 'Fetching Event Failed!'
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

  let imagePath = req.body.imagePath;

  console.log('req.body');
  console.log(req.body);

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  } 

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
    picture : imagePath
  })

  // console.log('result');

  // console.log(event);

  Event.updateOne({
      _id: req.body.id,
      author: req.userData.userId
    },  {
      $set: {
        _id: event.id,
        location: event.location,
        distance: event.distance,
        pace: event.pace,
        eventDate: event.eventDate,
        picture: event.picture
      }

    } 

    )

    .then(result => {
      // console.log('result');

      // console.log(result);
      
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

  console.log('Delete API');
  

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
      Comment.find({
          event: eventId
        })
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

exports.eventLikeSwitcher = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const eventId = req.params.event_id;

  Event.findById(eventId)
    .then(
      event => {
        if (!event) {
          const error = new Error('Could not find user');
          error.statusCode = 404;
          throw error;
        }

        let contains = false;

        if (event.likes.length < 1) {
          contains = false;
        } else {

          for (let i = 0; i < event.likes.length; i++) {
            if (event.likes[i].toString() === req.userData.userId.toString()) {
              contains = true;
              break;
            }

          }
        }

        if (!contains) {
          event.likes.push(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, { $push: { "likedEvent" : eventId } }).then(user => { user.save() });
        } else {

          event.likes.pull(req.userData.userId)
          User.findByIdAndUpdate(req.userData.userId, { $pull: { "likedEvent" : eventId } }).then(user => { user.save() });
        }

        event.save();

        res.status(201).json({
          // message: "Like added",
          likes: event.likes
        });
      })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
}


exports.participateAtEvent = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const eventId = req.params.event_id;

  Event.findById(eventId)
    .then(
      event => {
        if (!event) {
          const error = new Error('Could not find user');
          error.statusCode = 404;
          throw error;
        }

        let contains = false;

        if (event.runners.length < 1) {
          contains = false;
        } else {

          for (let i = 0; i < event.runners.length; i++) {
            if (event.runners[i].toString() === req.userData.userId.toString()) {
              contains = true;
              break;
            }

          }
        }

        if (!contains) {
          event.runners.push(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, { $push: { "eventWillAttempt" : eventId } }).then(user => { user.save() });
        } else {
          event.runners.pull(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, { $pull: { "eventWillAttempt" : eventId } }).then(user => { user.save() });
        }

        event.save();

        res.status(201).json({
          message: "Participate Event planned",
        });
      })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
}