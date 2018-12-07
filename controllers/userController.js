const { validationResult } = require('express-validator/check');

var bcrypt = require('bcryptjs');
var User = require('../models/user_model');
var constants = require('../constants/messages');
var jwt = require('jsonwebtoken');
var Comment = require('../models/comment_model');
var Event = require('../models/event_model');


exports.register = function(req, res, next){

const errors = validationResult(req);

if (!errors.isEmpty()) {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.data = errors.array();
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
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch( error => {
      if (!error.statusCode) {
       error.statusCode = 500;
   }
   next(error);
   });
  });
}

exports.uploadAvatar = function(req, res, next){
  res.send('tbc')
}

exports.sign_in = function(req, res, next){

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
let fetchedUser;
User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          const error = new Error("user not found.");
          error.statusCode = 404;
          throw error;
        } 
        const res = bcrypt.compare(req.body.password, user.password)

        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          const error = new Error("Auth failed.");
          error.statusCode = 401;
          throw error;
        }        
        const token = jwt.sign({email: fetchedUser.email, username: fetchedUser.username, userId: fetchedUser._id.toString()}, process.env.JWT_KEY, {expiresIn: '1h'});
        res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id.toString(), message: constants.success.login});
      })
      .catch( error => {
        if (!error.statusCode) {
         error.statusCode = 500;
     }
     next(error);
     });
};

/*
  Returns user with the given id.
*/

exports.getUserProfile = function(req, res, next){

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
        if(!user) {
          const error = new Error("No user find.");
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({user: user });
      })
      .catch( error => {
        if (!error.statusCode) {
         error.statusCode = 500;
     }
     next(error);
     });

}

exports.deleteUser = function(req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.params.user_id;
console.log(userId);

  User.findById(userId)
  .then(user => {
    if(!user) {
      const error = new Error("No user find.");
      error.statusCode = 404;
      throw error;
    }
    if (user._id.toString() !== req.userData.userId) {
      const error = new Error("You are not authorized to do so.");
      error.statusCode = 401;
      throw error;
    }

    console.log('inside *****************');
    // console.log(user);

    

    Comment.find({ author: user._id })
           .then(comment => {
            // console.log('inside error');

            if(!comment){
              const error = new Error("Can't find comment by author id");
              error.statusCode = 404;
              throw error;
            }

            for (var i = 0; i < comment.length; i++) {
            // console.log('inside commentloop');
            console.log(comment[i]);

              comment[i].remove()
            }
              });

              // console.log('inside after comment*****************');

    Event.find({author: userId})
         .then(event => {
          for (var i = 0; i < event.length; i++) {
            event[i].remove()
          }
         })

        //  console.log('inside end*****************');


    user.remove();

  })
  .then(result => {
    res.status(200).json({message: 'User deleted' });
  })
  .catch( error => {
    if (!error.statusCode) {
     error.statusCode = 500;
 }
 next(error);
 });

}
