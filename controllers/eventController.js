const {
  validationResult
} = require('express-validator/check');
var constants = require('../constants/messages');
var User = require('../models/user_model');
var Event = require('../models/event_model');
var Comment = require('../models/comment_model');

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});


// console.log(new Date(searchedEventDate).toISOString());

exports.getEvents = function (req, res, next) {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const searchedEventDate = req.query.filterDate;
  const searchedEventDistance = req.query.eventDistance;
  console.log(searchedEventDistance);


  let currentDate = Date.now();
  var isoCurrentDate = new Date(currentDate).toISOString();

  let eventCounted;
  let fetchedEvent;

  let eventQuery;

  if (!searchedEventDate && !searchedEventDistance) {
    eventQuery = Event.find({
      eventDate: {
        $gt: isoCurrentDate
      }
    });
    Event.find({
      eventDate: {
        $gt: isoCurrentDate
      }
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDate && searchedEventDistance) {
    eventQuery = Event.find({
      distance: searchedEventDistance,
      eventDate: searchedEventDate
    });
    Event.find({
      distance: searchedEventDistance,
      eventDate: searchedEventDate
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDate) {
    eventQuery = Event.find({
      eventDate: searchedEventDate
    });
    Event.find({
      eventDate: searchedEventDate
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDistance) {
    eventQuery = Event.find({
      distance: searchedEventDistance
    });
    Event.find({
      distance: searchedEventDistance
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  }





  if (pageSize && currentPage) {
    eventQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  eventQuery
    .then(events => {

      fetchedEvent = events.map(event => {
        // eventCount++;
        return {
          _id: event._id,
          location: event.location,
          picture: event.picture,
          author: event.author,
          eventDate: event.eventDate,
          pace: event.pace,
          title:  event.title,
          distance: event.distance
        }
      })
      return Event.count();
    })
    .then(eventCount => {
      console.log(eventCounted);

      res.status(200).json({
        message: 'Fetched Posts',
        events: fetchedEvent,
        maxEvents: eventCounted
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
    picture: imagePath,
    title:  req.body.title,
    description: req.body.description
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

      User.findById(req.userData.userId)
        .then(user => {

          const emailToSend = {
            from: '"LetsRun" <events@letsrun.com>',
            to: user.email,
            subject: "You have added new event",
            text: "New event",
            html: `
            <p>You have added new Event</p>
            <p> You can visit it from your profile and by finding it on main page or simply by clicking on this <a href="http://localhost:4200/events/${createdEvent._id}">link</a></p>
            <p>You'r Lets Run team!</p>
          `
          };

          transporter.sendMail(emailToSend, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });


        });

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

  let imagePath = req.body.picture;

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
    description: req.body.description,
    title:  req.body.title,
    picture: imagePath
  })

  Event.updateOne({
      _id: req.body.id,
      author: req.userData.userId
    }, {
      $set: {
        _id: event.id,
        location: event.location,
        distance: event.distance,
        description: event.description,
        pace: event.pace,
        title:  event.title,
        eventDate: event.eventDate,
        picture: event.picture
      }
    })

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

      User.findOne({
          createdEvent: eventId
        })
        .then(user => {

          const emailToSend = {
            from: '"LetsRun" <events@letsrun.com>',
            to: user.email,
            subject: "You have deleted event",
            text: "Delete event",
            html: `
              <p>You have <span style="color: red"> deleted </span> event</p>
              <p>We are waiting more events from you</p>
              <p>You'r Lets Run team!</p>
            `
          };

          transporter.sendMail(emailToSend, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });

        })


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
          User.findById(event.author)
            .then(user => {

              const emailToSend = {
                from: '"LetsRun" <events@letsrun.com>',
                to: user.email,
                subject: "You'r event liked",
                text: "Liked event",
                html: `
                  <h1 style="text-align: center">You'r <a href="http://localhost:4200/events/${eventId}">event</a> have been liked</h1>
                  <p></p>
                  <p>You'r Lets Run team!</p>
                `
              };

              transporter.sendMail(emailToSend, function (err, info) {
                if (err)
                  console.log(err)
                else
                  console.log(info);
              });

            })
          event.likes.push(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, {
            $push: {
              "likedEvent": eventId
            }
          }).then(user => {
            user.save()
          });
        } else {

          event.likes.pull(req.userData.userId)
          User.findByIdAndUpdate(req.userData.userId, {
            $pull: {
              "likedEvent": eventId
            }
          }).then(user => {
            user.save()
          });
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
          User.findById(event.author)
            .then(user => {

              const emailToSend = {
                from: '"LetsRun" <events@letsrun.com>',
                to: user.email,
                subject: "You'r event heve new attempt",
                text: "New attempt event",
                html: `
                      <h1 style="text-align: center">You'r <a href="http://localhost:4200/events/${eventId}">event</a> have new attempt</h1>
                      <p></p>
                      <p>You'r Lets Run team!</p>
                      `
              };

              transporter.sendMail(emailToSend, function (err, info) {
                if (err)
                  console.log(err)
                else
                  console.log(info);
              });

            })
          event.runners.push(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, {
            $push: {
              "eventWillAttempt": eventId
            }
          }).then(user => {

            user.save()
          });
        } else {
          event.runners.pull(req.userData.userId);
          User.findByIdAndUpdate(req.userData.userId, {
            $pull: {
              "eventWillAttempt": eventId
            }
          }).then(user => {
            user.save()
          });
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