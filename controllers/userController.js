const {
  validationResult
} = require('express-validator/check');

var bcrypt = require('bcryptjs');
var User = require('../models/user_model');
var constants = require('../constants/messages');
var jwt = require('jsonwebtoken');
var Comment = require('../models/comment_model');
var Event = require('../models/event_model');


exports.register = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  if(req.body.password !== req.body.validatePassword) {
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
        email: req.body.email
      });
      user.save()
        .then(result => {
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

/*
  Returns user with the given id.
*/

exports.getUserProfile = function (req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.params.user_id;

  User.findById(userId)
    .populate('following', '_id imagePath username')
    .populate('followers', '_id imagePath username')
    .populate('createdEvent', '_id location picture eventDate')
    .populate('eventWillAttempt', '_id location picture eventDate')
    .then(user => {
      if (!user) {
        const error = new Error("No user find.");
        error.statusCode = 404;
        error.data = "No user find.";
        throw error;
      }

      let modifiedUser = new User({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        followers: user.followers,
        following: user.following,
        imagePath: user.imagePath,
        eventWillAttempt: user.eventWillAttempt,
        createdEvent: user.createdEvent,
        dob: user.dob,
        createdAt: user.createdAt
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


exports.followPersonController = function (req, res, next) {

  const userId = req.params.user_id;

  let fetchedUser;

  User.findById(userId)
    .then(followerToAd => {

      if (!followerToAd) {
        const error = new Error('Could not find user');
        error.statusCode = 404;
        error.data = "Could not find user";
        throw error;
      }

      fetchedUser = followerToAd;
    })

  User.findById(req.userData.userId)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find user');
        error.statusCode = 404;
        error.data = "Could not find user";
        throw error;
      }

      if (user._id.toString() === fetchedUser._id.toString()) {
        const error = new Error("You cannot follow your self, sorry! :)");
        error.statusCode = 501;
        throw error;
      }

      let contains = false;

      if (user.following.length < 1) {
        contains = false;
      } else {

        for (let i = 0; i < user.following.length; i++) {
          if (user.following[i].toString() === fetchedUser._id.toString()) {
            contains = true;
            break;
          }

        }
      }

      if (!contains) {
        user.following.push(fetchedUser._id);
        User.findByIdAndUpdate(fetchedUser._id, {
          $push: {
            "followers": user._id
          }
        }).then(user => {
          user.save()
        });
      } else {
        user.following.pull(fetchedUser._id);
        User.findByIdAndUpdate(fetchedUser._id, {
          $pull: {
            "followers": user._id
          }
        }).then(user => {
          user.save()
        });
      }

      user.save();

      res.status(201).json({
        message: "Following and followers changed",
      });

    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });

};


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
    user.save()
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