const {
  validationResult
} = require('express-validator/check');
const crypto = require('crypto');
var bcrypt = require('bcryptjs');
var User = require('../models/user_model');
var constants = require('../constants/messages');
var jwt = require('jsonwebtoken');
var Comment = require('../models/comment_model');
var Event = require('../models/event_model');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

///////////////////////////////////////////////////////
//              REGISTER USER
///////////////////////////////////////////////////////
exports.register = function (req, res, next) {
  let token;

  crypto.randomBytes(32, (err, buffer) => {
    token = buffer.toString('hex');
  });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      let error;
      error = new Error(req._validationErrors[0].msg);
      if (!error) {
        error = new Error('Validation failed.');
      }
      error.statusCode = 422;
      // error.data = errors.array();
      throw error;
    }

    if (req.body.password !== req.body.validatePassword) {
      const error = new Error("Passwords are not matching.");
      error.statusCode = 501;
      throw error;
    }


    bcrypt.hash(req.body.password, 12)
      .then(hashedPw => {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          dob: req.body.dob,
          password: hashedPw,
          email: req.body.email,
          authToken: token
        });
        user.save()
          .then(result => {

            const emailToSend = {
              from: '"LetsRun" <events@letsrun.com>',
              to: user.email,
              subject: "You have to Authenticate",
              text: "You have to Authenticate",
              html: `
            <p>You have to Authenticate</p>
            <p> You need to authenticate your self</p>
            <p> simply by clicking on this <a href="http://localhost:4200/auth/${token}">link</a></p>
            <p>You'r Lets Run team!</p>
          `
            };

            transporter.sendMail(emailToSend, function (err, info) {
              if (err)
                console.log(err);
              else
                console.log(info);
            });

            res.status(201).json({
              message: 'User created!',
              userId: result._id
            });
          })
          .catch(error => {
            if (!error.statusCode) {
              console.log('error');

              console.log(error);

              error.statusCode = 500;
            }
            next(error);
          });
      });
  
};

///////////////////////////////////////////////////////
//              ACTIVATE USER
///////////////////////////////////////////////////////

exports.activetUser = async function (req, res, next) {
  const errors = validationResult(req);
  userToken = req.params.authToken;

  try {
    var user = await User.findOne({
      authToken: userToken
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    user.activated = true;

    user.save();

    const emailToSend = {
      from: '"LetsRun" <events@letsrun.com>',
      to: user.email,
      subject: "You have Authenticated",
      text: "You have Authenticated",
      html: `
      <p>You have Authenticated</p>
      <p>You can now post new events and comments and be the one of our community!</p>
      <p>You'r Lets Run team!</p>
    `
    };

    transporter.sendMail(emailToSend, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });

    res.status(200).json({
      message: 'User Authenticated!'
    });
  } catch (error) {
    next(error);
  }
};

///////////////////////////////////////////////////////
//              SIGN IN USER
///////////////////////////////////////////////////////

exports.sign_in = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        const error = new Error("user not found.");
        error.statusCode = 404;
        // error.data = "User not found.";
        throw error;
      }
      const res = bcrypt.compare(req.body.password, user.password)

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        const error = new Error("Email or password is incorect..");
        error.statusCode = 401;
        // error.data = "Email or password is incorect.";
        throw error;
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        username: fetchedUser.username,
        userId: fetchedUser._id.toString()
      }, process.env.JWT_KEY, {
        expiresIn: '1h'
      });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id.toString(),
        username: fetchedUser.username,
        message: constants.success.login
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

///////////////////////////////////////////////////////
//             PUBLIC EVENTS AND FRIENDS FOR USER
///////////////////////////////////////////////////////

exports.getUserProfile = function (req, res, next) {

  const errors = validationResult(req);
  const userId = req.params.user_id;

  const queryParams = req.query.info;

  let followersPopulation = '';
  let followersPopulationDetails = '';

  let followingPopulation = '';
  let followingPopulationDetails = '';

  let createdEventsPopulation = '';
  let createdEventsPopulationDetails = '';

  let eventsWillAttemptPopulation = '';
  let eventsWillAttemptPopulationDetails = '';

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let match;
   match = {privateEvent: false};

  if (queryParams === 'friends') {
    followingPopulation = 'following';
    followingPopulationDetails = '_id imagePath username';
    
    followersPopulation = 'followers';
    followersPopulationDetails = '_id imagePath username';
  } else if (queryParams === 'eventHistory') {
    createdEventsPopulation = 'createdEvent';
    createdEventsPopulationDetails = '_id title picture eventDate';

    eventsWillAttemptPopulation = 'eventWillAttempt';
    eventsWillAttemptPopulationDetails = '_id title picture eventDate';
  }


  User.findById(userId)
    .populate({path: followersPopulation, select: followersPopulationDetails})
    .populate({path: followingPopulation, select: followingPopulationDetails})
    .populate({path: createdEventsPopulation, select: createdEventsPopulationDetails,match:  match})
    .populate({path: eventsWillAttemptPopulation, select: eventsWillAttemptPopulationDetails,match:  match})
    .then(user => {
      if (!user) {
        const error = new Error("No user find.");
        error.statusCode = 404;
        error.data = "No user find.";
        throw error;
      }

      let modifiedUser;

      modifiedUser = new User({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imagePath: user.imagePath,
        dob: user.dob,
        createdAt: user.createdAt
      });

      if (queryParams === 'friends') {
        modifiedUser = new User({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          followers: user.followers,
          following: user.following,
          imagePath: user.imagePath
        });
      } else if (queryParams === 'eventHistory' || queryParams === 'privateEvents') {
        modifiedUser = new User({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          imagePath: user.imagePath,
          eventWillAttempt: user.eventWillAttempt,
          createdEvent: user.createdEvent
        });
      }

      res.status(200).json({
        user: modifiedUser
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });

};

///////////////////////////////////////////////////////
//              PRIVATE EVENTS FOR USER
///////////////////////////////////////////////////////

exports.getPrivateUserProfile = function (req, res, next) {

  const errors = validationResult(req);
  const userId = req.params.user_id;

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  console.log('userId.toString()');
  console.log(userId.toString());
  
  console.log('req.userData.userId.toString()');
  console.log(req.userData.userId.toString());

  if(userId.toString() !== req.userData.userId.toString()) {
    const error = new Error("You are not authorized to do so.");
    error.statusCode = 401;
    error.data = "You are not authorized to do so.";
    throw error;
  }

  const match = {privateEvent: true};

  let createdEventsPopulation = 'createdEvent';
  let createdEventsPopulationDetails = '_id title picture eventDate privateEvent';

  let eventsWillAttemptPopulation = 'eventWillAttempt';
  let eventsWillAttemptPopulationDetails = '_id title picture eventDate privateEvent';

  User.findById(userId)
  .populate({path: createdEventsPopulation, select: createdEventsPopulationDetails,match:  match})
  .populate({path: eventsWillAttemptPopulation, select: eventsWillAttemptPopulationDetails,match:  match})
    .then(user => {
      if (!user) {
        const error = new Error("No user find.");
        error.statusCode = 404;
        error.data = "No user find.";
        throw error;
      }
      console.log('user');
      console.log(user);
      

      let modifiedUser;

      modifiedUser = new User({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imagePath: user.imagePath,
        dob: user.dob,
        createdAt: user.createdAt
      });

        modifiedUser = new User({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          imagePath: user.imagePath,
          eventWillAttempt: user.eventWillAttempt,
          createdEvent: user.createdEvent
        });
      

      res.status(200).json({
        user: modifiedUser
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });

};
///////////////////////////////////////////////////////
//              DELETE USER
///////////////////////////////////////////////////////
exports.deleteUser = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.params.user_id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error("No user find.");
        error.statusCode = 404;
        error.data = "No user find.";
        throw error;
      }
      if (user._id.toString() !== req.userData.userId.toString()) {
        const error = new Error("You are not authorized to do so.");
        error.statusCode = 401;
        error.data = "You are not authorized to do so.";
        throw error;
      }

      Comment.find({
          author: user._id
        })
        .then(comment => {

          if (!comment) {
            const error = new Error("Can't find comment by author id");
            error.statusCode = 404;
            error.data = "Can't find comment by author id";
            throw error;
          }

          for (var i = 0; i < comment.length; i++) {

            comment[i].remove()
          }
        });

      Event.find({
          author: userId
        })
        .then(event => {
          for (var i = 0; i < event.length; i++) {
            event[i].remove()
          }
        })

      user.remove();

    })
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });

};

///////////////////////////////////////////////////////
//              FOLLOW MANIPULATOR
///////////////////////////////////////////////////////
exports.followPersonController = function (req, res, next) {

  const userId = req.params.user_id;

  let userToFollowPromise = new Promise((resolve,reject) => {
    User.findById(userId)
        .then(user => {

          if (!user) {
            const error = new Error('Could not find user');
            error.statusCode = 404;
            error.data = "Could not find user";
            reject(error);
          }else{
            resolve(user);
          }

        })
        .catch((err) => {
          reject(err);
        })
  });

  let getCurrentUserPromise = new Promise((resolve, reject) => {
    User.findById(req.userData.userId)
        .then(user => {
          if (!user) {
            const error = new Error('Could not find user');
            error.statusCode = 404;
            error.data = "Could not find user";
            reject(error);
          }else{
            resolve(user);
          }
        })
        .catch((err) => {
          reject(err);
        })
  });

  Promise.all([userToFollowPromise,getCurrentUserPromise])
      .then((usersArray) => {
        let selectedUserFollow = usersArray[0];
        let curUser = usersArray[1];

        if (curUser._id.toString() === selectedUserFollow._id.toString()) {
          res.status(501).json({
            message: "You cannot follow your self, sorry! :)"
          })
        }else{

          if(curUser.following.map((followedUserId) => {return followedUserId._id.toString();}).includes(selectedUserFollow._id.toString())){

            User.findByIdAndUpdate(selectedUserFollow._id, {
              $pull: {
                "followers": curUser._id
              }
            })
                .then(unfollowedUser => {
                  User.findByIdAndUpdate(curUser._id, {
                    $pull: {
                      "following": unfollowedUser._id
                    }
                  })
                      .then(updatedCurUser => {
                        console.log(unfollowedUser.followers);
                        unfollowedUser.save();
                        updatedCurUser.save();
                        res.status(201).json({
                          message: "Following and followers changed",
                        });
                      })
                      .catch(() => {
                        res.status(501).json({
                          message: "some error has occurred"
                        })
                      });
                })
                .catch((err) => {
                  res.status(501).json({
                    message: "some error has occurred"
                  })
                });
          }else{
            User.findByIdAndUpdate(selectedUserFollow._id, {
              $push: {
                "followers": curUser._id
              }
            })
                .then(followedUser => {
                  User.findByIdAndUpdate(curUser._id,{
                    $push: {
                      "following": followedUser._id
                    }
                  })
                      .then(updatedCurrentUser => {
                        followedUser.save();
                        updatedCurrentUser.save();
                        res.status(201).json({
                          message: "Following and followers changed",
                        });
                      })
                      .catch(() => {
                        res.status(501).json({
                          message: "some error has occurred"
                        })
                      });

                })
                .catch((err) => {
                  res.status(501).json({
                    message: "some error has occurred"
                  })
                })
          }
        }
      })
      .catch((err) => {
        res.status(501).json({
          message: "some error has occurred when retrieving user"
        })
      });

};

///////////////////////////////////////////////////////
//              ADD AVATAR FOR THE USER
///////////////////////////////////////////////////////

exports.add_avatar = function (req, res, next) {
  let imagePath = req.body.imagePath;

  if (req.file) {
    console.log('file');

    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  User.findByIdAndUpdate({
    _id: req.userData.userId
  }, {
    $set: {
      "imagePath": imagePath
    }
  }).then(user => {
    user.save();
    res.status(201).json({
      message: "Avatar changed",
    });
  }).catch(error => {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  });

};
///////////////////////////////////////////////////////
//              RESET PASSWORD FOR THE USER
///////////////////////////////////////////////////////
exports.resetPasswordGetToken = async function (req, res, next) {
  console.log('RESETE');
  
  let token;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      const error = err;
      error.statusCode = 500;
      error.data = "No user find.";
      throw error;
    }

    token = buffer.toString('hex');

  });

  try {
    const user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      const error = new Error('No account with that email found.');
      error.statusCode = 404;
      error.data = "No account with that email found.";
      throw error;
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 36000000;
    user.save();

    const emailToSend = {
      from: '"LetsRun" <events@letsrun.com>',
      to: user.email,
      subject: "You have requested to change your password",
      text: "You have requested to change your password",
      html: `
    <p>You have received this email because you have requested to change your password</p>
    <p> If it was not you, please don't click on this link, and your password will not change!</p>
    <p> If it was you, simply click on this <a href="http://localhost:4200/auth/resetPassword/${token}">link to change your password</a></p>
    <p>You'r Lets Run team!</p>
  `
    };

    transporter.sendMail(emailToSend, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });

    res.status(201).json({
      message: 'email send'
    });

  } catch (err) {
    next(err);
  }
};

///////////////////////////////////////////////////////
//              GATHER INFORMATION FOR PASSWORD CHANGE
///////////////////////////////////////////////////////

exports.getChangePassword = async function (req, res, next) {
  const token = req.params.token;
  
  try {

    user = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}});

    res.status(200).json({
      message: 'Info to change password',
      userId: user._id.toString(),
      passwordToken: token
    });

  } catch(error) {
    next(error);
  }

};
///////////////////////////////////////////////////////
//              PASSWORD CHANGE
///////////////////////////////////////////////////////
exports.changePassword = async function(req, res, next) {
  const resetToken =  req.body.resetToken;
  const userId =      req.body.userId;
  const newPassword = req.body.password;

  try {

    const user = await User.findOne({resetToken: resetToken,
                               resetTokenExpiration: {$gt: Date.now()},
                               _id: userId});
    if (!user) {
      const error = new Error('No account found.');
      error.statusCode = 404;
      error.data = "No account found.";
      throw error;
    }

    const hashedPw = await bcrypt.hash(newPassword, 12);
    user.password = hashedPw;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    user.save();

    res.status(200).json({
      message: 'Password changed'
    });

  }catch(err) {
    next(err);
  }

};
