'use strict'

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('users', require('../models/user_model'));
var constants = require('../constants/messages');
var jwt = require('jsonwebtoken');
var validator = require('validator');
var Promise = require('promise');

exports.register = function(req,res){
  validateRegistrationForm(req.body).then(function(validatedForm){
      var newUser = new User(validatedForm.validatedForm);
      newUser.hash = bcrypt.hashSync(req.body.password, 10);
      newUser.save(function(err,user){
        if(err){
          return res.status(500).send({
            errors: constants.errors.badServer
          });
        }else{
          return res.status(200).send({
            message: constants.success.registration
          })
        }
      })
  },function(err){
    return res.status(404).json({
      message: constants.errors.registration,
      errors: err,
      success: false
    });
  })
}

exports.sign_in = function(req,res){
  User.findOne({
    email: req.body.email
  },function(err,user){
    if(err) throw err;
    if(!user){
      res.status(404).json({message: constants.errors.badAuth});
    }else{
      if(user.comparePasswords(req.body.password)){
        var token = jwt.sign({email: user.email, username: user.username, _id: user._id}, 'RESTFULAPIs');
        res.status(200).json({token: token, message: constants.success.login});
      }else{
        res.status(404).json({message: constants.errors.badAuth});
      }
    }
  })
};

/*
  Returns user with the given id.
*/
exports.getUser = function(user_id){
  return new Promise(function(fulfill,reject){
    User.findById(user_id,"-hash",function(err,user){
      if(err) reject (constants.errors.badServer);
      fulfill(user);
    })
  })
}

exports.loginRequired = function(req,res,next){
  if(req.user){
    next();
  }else{
    return res.status(401).json({message: 'Please sign in'});
  }
};

  function validateRegistrationForm(payload){
    return new Promise(function(fulfill,reject){
      const errors = {};
      let isFormValid = true;
      let validatedForm = '';
      let emailValidation = new Promise((fulfill, reject) => {
      if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email.trim())){
        isFormValid = false;
        errors.email = 'The email provided is not valid.';
        fulfill();
      }else{
        User.findOne({'email': payload.email.trim()},function(err,person){
          if(person){
            isFormValid = false;
            errors.email = "The email is already taken";
            fulfill();
          }else{
            fulfill();
          }
        })
      }
    })

    let usernameValidation = new Promise((fulfill,reject) => {
      if(!payload || typeof payload.username !== 'string' || payload.username.trim().length < 8){
        isFormValid = false;
        errors.username = "The username must be over 8 characters long";
        fulfill();
      }else{
        User.findOne({'username': payload.username.trim()},function(err,person){
          if(person){
            isFormValid = false;
            errors.username = "The username is already taken";
            fulfill();
          }else{
            fulfill();
          }
        })
      }
    })

    if(!payload ||  typeof payload.password !== 'string' || payload.password.trim().length < 8){
      isFormValid = false;
      errors.password = 'The password must have at least 8 characters.';
    }

    if(!payload || typeof payload.firstName !== 'string' || payload.firstName.trim().length === 0){
      isFormValid = false;
      errors.firstName = "Please provide your first name.";
    }

    if(!payload || typeof payload.lastName !== 'string' || payload.lastName.trim().length === 0){
      isFormValid = false;
      errors.lastName = "Please provide your last name.";
    }

    Promise.all([emailValidation,usernameValidation]).then(function(){

        if(isFormValid){
          validatedForm = {
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            username: payload.username.trim(),
            email: payload.email.trim(),
            password: payload.password.trim()
          };
          fulfill({ validatedForm});
        }else{
          reject(errors);
        }
    })
  })
}

function validateLoginForm(payload){
  const errors = {};
  let isFormValid = true;
  let message = '';

  if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)){
    isFormValid = false;
    errors.email = 'The email provided is not valid.';
  }

  if(!payload ||  typeof payload.password !== 'string' || payload.password.trim().length < 8){
    isFormValid = false;
    errors.password = 'The password must have at least 8 characters.';
  }

  if(!isFormValid){
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}
