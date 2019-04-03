const {
  validationResult
} = require('express-validator/check');

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);


var constants = require('../constants/messages');
var htmlTemplates = require('../constants/htmlTemplateForEmail');
const quotes = require('../constants/emailQuotesArray');
var User = require('../models/user_model');
var Event = require('../models/event_model');
var Comment = require('../models/comment_model');

var nodemailer = require('nodemailer');

const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
  projectId: "lets-run-bce4d",
  keyFilename: 'lets-run-bce4d-firebase-adminsdk-98kk9-f06853bcf5.json'
});

// const bucket = storage.bucket("gs://lets-run-bce4d.appspot.com");
const bucketName = "gs://lets-run-bce4d.appspot.com";
const bucketNameMini = "lets-run-bce4d.appspot.com";


var transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

///////////////////////////////////////////////////////
//              GET EVENTS
///////////////////////////////////////////////////////


exports.getEvents = function (req, res, next) {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const searchedEventDate = req.query.filterDate;
  const searchedEventDistance = req.query.eventDistance;


  let currentDate = Date.now();
  
  let modDate = new Date(currentDate).setDate(new Date(currentDate).getDate() - 1);
  var isoCurrentDate = new Date(modDate).toISOString();

  let eventCounted;
  let fetchedEvent;

  let eventQuery;

  if (!searchedEventDate && !searchedEventDistance) {
    eventQuery = Event.find({
      eventDate: {
        $gt: isoCurrentDate
      },
      privateEvent: false
    });
    Event.find({
      eventDate: {
        $gt: isoCurrentDate
      },
      privateEvent: false
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDate && searchedEventDistance) {
    eventQuery = Event.find({
      distance: searchedEventDistance,
      eventDate: searchedEventDate,
      privateEvent: false
    });
    Event.find({
      distance: searchedEventDistance,
      eventDate: searchedEventDate,
      privateEvent: false
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDate) {
    eventQuery = Event.find({
      eventDate: searchedEventDate,
      privateEvent: false
    });
    Event.find({
      eventDate: searchedEventDate,
      privateEvent: false
    }).countDocuments().then(countedDocuments => {
      eventCounted = countedDocuments
    });
  } else if (searchedEventDistance) {
    eventQuery = Event.find({
      distance: searchedEventDistance,
      privateEvent: false
    });
    Event.find({
      distance: searchedEventDistance,
      privateEvent: false
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
          eventTime: req.body.eventTime,
          pace: event.pace,
          title:  event.title,
          distance: event.distance,
          privateEvent: event.privateEvent
        }
      })
      return Event.count();
    })
    .then(eventCount => {

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
///////////////////////////////////////////////////////
//              ADD EVENT
///////////////////////////////////////////////////////
exports.addEvent = async function (req, res, next) {

  let imagePath = req.body.imagePath;

try {

  if (req.file) {
    const filenameDes = req.file.destination + "/" + req.file.filename;
  
    await uploadFile(bucketName, filenameDes)
               .then(result => {
                 let url = `https://storage.googleapis.com/${bucketNameMini}/events/${filenameDes}`;
                 imagePath = url;
               });
  }

  const event = new Event({
    location: req.body.location,
    distance: req.body.distance,
    pace: req.body.pace,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime.toString(),
    author: req.userData.userId,
    picture: imagePath,
    title:  req.body.title,
    description: req.body.description,
    privateEvent: req.body.privateEvent
  });

  const createdEvent = await event.save();

  await       User.update({
    _id: req.userData.userId
  }, {
    $push: {
      createdEvent: createdEvent._id
    }
  }, result => {
    console.log(result);
  })

  const user = await User.findById(req.userData.userId);

  let html;

  var boolValue = JSON.parse(req.body.privateEvent);

  const randNumber = Math.floor((Math.random() * 45));

  if(!boolValue) {
    html = htmlTemplates.htmlEmailTemplate.header  +
     `<h4>You have added new Event</h4>`    + 
     htmlTemplates.htmlEmailTemplate.middle + 
    `<p style="text-align: center; font-size: 1.5rem;">You can visit it from your profile, by finding it on main page or simply by clicking on this <a href="http://localhost:4200/events/${createdEvent._id}">link</a></p>` +
    htmlTemplates.htmlEmailTemplate.quoter +
    `<p style=" color: #2dc394;">Random quote!</p>
    <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
     <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
    htmlTemplates.htmlEmailTemplate.footer
  } else if(req.body.privateEvent) {
    html = htmlTemplates.htmlEmailTemplate.header  +
    `<h4>You have added new <span style="color: red">private</span> Event</h4>`    + 
    htmlTemplates.htmlEmailTemplate.middle + 
   `<p style="text-align: center; font-size: 1.5rem;">You can visit it from your profile in private events or simply by clicking on this <a href="http://localhost:4200/events/${createdEvent._id}">link</a></p>` +
   htmlTemplates.htmlEmailTemplate.quoter +
   `<p style=" color: #2dc394;">Random quote!</p>
   <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
    <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
   htmlTemplates.htmlEmailTemplate.footer
  }


  const emailToSend = {
    from: '"LetsRun" <events@letsrun.com>',
    to: user.email,
    subject: "You have added new event",
    text: "New event",
    html: html,
    attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate
  };

  transporter.sendMail(emailToSend, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });

  res.status(201).json({
    message: "Event created",
    event: {
      ...createdEvent,
      id: createdEvent._id
    }
  });

} catch(error) {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
    next(error);
}
}


///////////////////////////////////////////////////////
//              GET EVENT BY ID
///////////////////////////////////////////////////////
exports.getEvent = function (req, res, next) {
  console.log('req.userData');
  console.log(req.userData);
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

      if(foundEvent.privateEvent && !(foundEvent.userInvited.indexOf(req.userData.userId.toString()) > -1) && (foundEvent.author.toString() !== req.userData.userId.toString()) ) {
          const error = new Error("Sorry, this event marked for invited person's only");
          error.statusCode = 403;
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


///////////////////////////////////////////////////////
//              UPDATE EVENT
///////////////////////////////////////////////////////
exports.updateEvent = async function (req, res, next) {

  let imagePath = req.body.picture;

  let file = req.file;
  let image = req.body.picture;

  try {
    if (req.file) {

      const filenameDes = req.file.destination + "/" + req.file.filename;
  
     await uploadFile(bucketName, filenameDes)
                .then(result => {
                  let url = `https://storage.googleapis.com/${bucketNameMini}/events/${filenameDes}`;
                  imagePath = url;
                });
    }

    const eventFound = await  Event.findById(req.body.id);
    const eventImagePath = await eventFound.picture;
    const pictureNameToDelete =  eventImagePath.split("com/");
    let fileNameToDelete = pictureNameToDelete[2];

    deleteFile(bucketName, fileNameToDelete);

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
      eventTime: req.body.eventTime,
      description: req.body.description,
      title:  req.body.title,
      picture: imagePath,
      privateEvent: req.body.privateEvent
    })

   const result = await Event.updateOne({
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
        eventTime: event.eventTime,
        picture: event.picture,
        privateEvent: event.privateEvent
      }
    })

    if (result.n > 0) {
      const error = new Error('Update successful!');
      await unlinkAsync(req.file.path)
      error.statusCode = 201;
      throw error;
    } else {
      const error = new Error('Not authorized!');
      error.statusCode = 401;
      throw error;
    }

  } catch(error) {
    next(error);
}
}

///////////////////////////////////////////////////////
//              DELETE EVENT
///////////////////////////////////////////////////////
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

          const randNumber = Math.floor((Math.random() * 45));

          const emailToSend = {
            from: '"LetsRun" <events@letsrun.com>',
            to: user.email,
            subject: "You have deleted event",
            text: "Delete event",
            attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate,
            html: htmlTemplates.htmlEmailTemplate.header  +
            `<h4>You have <span style="color: red"> deleted </span> your event!</h4>`    + 
            htmlTemplates.htmlEmailTemplate.middle + 
           `<p style="text-align: center; font-size: 1.5rem;">We are waiting more events from you!</p>` +
           htmlTemplates.htmlEmailTemplate.quoter +
           `<p style=" color: #2dc394;">Random quote!</p>
           <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
            <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
           htmlTemplates.htmlEmailTemplate.footer
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


///////////////////////////////////////////////////////
//              INVITE TO THE EVENT
///////////////////////////////////////////////////////

exports.sendInvitesToTheFriends = async function (req, res, next) {
  const errors = validationResult(req);


  eventId = req.params.event_id;
  friendsArray = req.body.friendsToInvite;
  

  try {
    var event = await Event.findById(eventId);

    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

   await Promise.all(friendsArray.map(async friendId => {
      const foundUser = await User.findById(friendId);
      const inviterInfo = await User.findById(req.userData.userId.toString());

       if(foundUser.invitesToPrivateEvent.indexOf(eventId) > -1) {
        return;
     } else {
      foundUser.invitesToPrivateEvent.push(eventId);
      event.userInvited.push(friendId);

      const randNumber = Math.floor((Math.random() * 45));

      const emailToSend = {
        from: '"LetsRun" <events@letsrun.com>',
        to: foundUser.email,
        subject: "You have been invited to the private event!",
        text: "You have been invited to join the private event!",
        attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate,
            html: htmlTemplates.htmlEmailTemplate.header  +
            `<h4>You have been invited to join the private event!</h4>`    + 
            htmlTemplates.htmlEmailTemplate.middle + 
           `<p style="text-align: center; font-size: 1.5rem;">You have been invited to the private event by ${foundUser.username}</p>
           <p style="text-align: center; font-size: 1.5rem;">You can find it simply by clicking at this <a href="http://localhost:4200/events/${event._id}">link</a>! or by finding it in your profile page under privite invites menu!</p>` +
           htmlTemplates.htmlEmailTemplate.quoter +
           `<p style=" color: #2dc394;">Random quote!</p>
           <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
            <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
           htmlTemplates.htmlEmailTemplate.footer
      };
  
      transporter.sendMail(emailToSend, function (err, info) {
        if (err)
          console.log(err)
        else
          console.log(info);
      });

      foundUser.save();
     }
    }))
    event.save();
    




    res.status(200).json({
      message: 'Users invited!'
    });
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////////////
//       GET USER INVITED TO THE PRIVATE EVENT
///////////////////////////////////////////////////////

exports.getInvitedUsersForPrivateEvent = async function (req, res, next) {
  const errors = validationResult(req);


  eventId = req.params.event_id;
  

  try {
    var   event     = await Event.findById(eventId);

    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    const invitedUsers = event.userInvited;
    
    res.status(200).json({
      message: 'List of the invited users!',
      invitedUsers: invitedUsers
    });
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////////////
//              EVENT LIKE MANIPULATION
///////////////////////////////////////////////////////
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
              
              const randNumber = Math.floor((Math.random() * 45));

              const emailToSend = {
                from: '"LetsRun" <events@letsrun.com>',
                to: user.email,
                subject: "You'r event liked",
                text: "Liked event",
                attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate,
                html: htmlTemplates.htmlEmailTemplate.header +
                      `<h4  style="text-align: center;">You'r event have been liked, you can find it by clicking this <a style="color: #67e634; text-decoration: none;" href="http://localhost:4200/events/${eventId}">link!</a></h4>` +
                      htmlTemplates.htmlEmailTemplate.middle + 
                      htmlTemplates.htmlEmailTemplate.quoter +
                      `<p style=" color: #2dc394;">Random quote!</p>
                      <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
                       <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
                      htmlTemplates.htmlEmailTemplate.footer
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

///////////////////////////////////////////////////////
//              EVENT ATTEMPT MANIPULATION
///////////////////////////////////////////////////////
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

              const randNumber = Math.floor((Math.random() * 45));

              const emailToSend = {
                from: '"LetsRun" <events@letsrun.com>',
                to: user.email,
                subject: "You'r event heve new attempt",
                text: "New attempt event",
                attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate,
                html: htmlTemplates.htmlEmailTemplate.header +
                      `<h4  style="text-align: center;">You'r <a href="http://localhost:4200/events/${eventId}">event</a> have new attempt</h4>` +
                      htmlTemplates.htmlEmailTemplate.middle + 
                      htmlTemplates.htmlEmailTemplate.quoter +
                      `<p style=" color: #2dc394;">Random quote!</p>
                      <p>&#65282;${quotes.quotesArray[randNumber].qoute}&#65282;</p> 
                       <p style="text-align: right; color: #2dc394;">&#9400;${quotes.quotesArray[randNumber].author}</p>` +
                      htmlTemplates.htmlEmailTemplate.footer
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

///////////////////////////////////////////////////////
//              GET EVENTS FOR HOME COMPONENT
///////////////////////////////////////////////////////

exports.getEventsForHomeComponent = async function(req, res, next) {
  console.log("HOme component");
  try {

    let currentDate = Date.now();

    let modDate = new Date(currentDate).setDate(new Date(currentDate).getDate() - 1);
    var isoCurrentDate = new Date(modDate).toISOString();

    const pastEvents = await Event.countDocuments({
      eventDate: {
        $lt: currentDate
      }
    });

    const futureEvents = await Event.countDocuments({
      eventDate: {
        $gt: isoCurrentDate
      }
    }).countDocuments();

        res.status(201).json({
          message: 'events found',
          pastEvents: pastEvents,
          futureEvents: futureEvents
        });

  } catch(error) {
      next(error);
  }
}

///////////////////////////////////////////////////////
//              // UPLOAD IMAGE TO GOOGLE CLOUD
///////////////////////////////////////////////////////


async function uploadFile(bucketName, file) {


  await storage.bucket(bucketName).upload(file, {

    destination: `events/${file}`,
    metadata: {
      cacheControl: 'no-cache',
    },
  }).catch(error => console.log(error)
  );

  console.log(`${file} uploaded to ${bucketName}.`);
  
  let url = `https://storage.googleapis.com/${bucketNameMini}/events/${file}`;
}


async function deleteFile(bucketName, filename) {

  await storage
    .bucket(bucketName)
    .file(filename)
    .delete();

  console.log(`gs://${bucketName}/${filename} deleted.`);
  // [END storage_delete_file]
}