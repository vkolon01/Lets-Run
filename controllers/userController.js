const { validationResult } = require('express-validator/check');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = require('../models/user_model');
var constants = require('../constants/messages');
var jwt = require('jsonwebtoken');
var validator = require('validator');
var Promise = require('promise');

exports.register = function(req,res){

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
    .catch( err => {
        res.status(500).json({
        message: constants.errors.registration
      });
    });
  });
}

exports.uploadAvatar = function(req,res){
  res.send('tbc')
}

exports.sign_in = function(req,res){
  
let fetchedUser;
User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed"
          });
        } 
        const res = bcrypt.compare(req.body.password, user.password)

        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }        
        const token = jwt.sign({email: fetchedUser.email, username: fetchedUser.username, userId: fetchedUser._id.toString()}, process.env.JWT_KEY, {expiresIn: '1h'});
        res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id.toString(), message: constants.success.login});
      })
      .catch( err => {
        res.status(404).json({message: constants.errors.badAuth});        
      });
};

/*
  Returns user with the given id.
*/

exports.getUserProfile = function(req,res){
    const userId = req.params.user_id;

    User.findById(userId)
      .then(user => {
        if(!user) {
          return res.status(404).json({message: constants.errors.userNotFound })
        }
        res.status(200).json({user: user });
      })
      .catch( err => {
        res.status(404).json({message: constants.errors.badAuth});        
      });

}


// exports.getUser = function(user_id){


//   return new Promise(function(fulfill,reject){
//     User.findById(user_id,"-hash",function(err,user){
//       if(err){
//         reject (constants.errors.userNotFound);
//       }
//       if(user){
//         fulfill(user);
//       }
//     })
//   })
// }

/*
  Push element into the record
*/
exports.pushToUser = function(user_id,field,value){
  return new Promise(function(fulfill,reject){
    User.findByIdAndUpdate(user_id,{$push:{[field]:value}},function(err,user){
      if(err) reject (constants.errors.badServer);
      fulfill(user);
    })
  })
}

//   function validateRegistrationForm(payload){
//     return new Promise(function(fulfill,reject){
//       const errors = {};
//       let isFormValid = true;
//       let validatedForm = '';
//       let emailValidation = new Promise((fulfill, reject) => {
//       if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email.trim())){
//         isFormValid = false;z
//         errors.email = 'The email provided is not valid.';
//         fulfill();
//       }else{
//         User.findOne({'email': payload.email.trim()},function(err,person){
//           if(person){
//             isFormValid = false;
//             errors.email = "The email is already taken";
//             fulfill();
//           }else{
//             fulfill();
//           }
//         })
//       }
//     })

//     let usernameValidation = new Promise((fulfill,reject) => {
//       if(!payload || typeof payload.username !== 'string' || payload.username.trim().length < 8){
//         isFormValid = false;
//         errors.username = "The username must be over 8 characters long";
//         fulfill();
//       }else{
//         User.findOne({'username': payload.username.trim()},function(err,person){
//           if(person){
//             isFormValid = false;
//             errors.username = "The username is already taken";
//             fulfill();
//           }else{
//             fulfill();
//           }
//         })
//       }
//     })

//     if(!payload ||  typeof payload.password !== 'string' || payload.password.trim().length < 8){
//       isFormValid = false;
//       errors.password = 'The password must have at least 8 characters.';
//     }

//     //Date validation. Needs further validation in order to check if the user is old enough
//     if(!payload || !payload.dob){
//       isFormValid = false;
//       errors.dob = "Please provide date of birth.";
//     }
//     if(!payload || typeof payload.firstName !== 'string' || payload.firstName.trim().length === 0){
//       isFormValid = false;
//       errors.firstName = "Please provide your first name.";
//     }

//     if(!payload || typeof payload.lastName !== 'string' || payload.lastName.trim().length === 0){
//       isFormValid = false;
//       errors.lastName = "Please provide your last name.";
//     }

//     Promise.all([emailValidation,usernameValidation]).then(function(){
//         if(isFormValid){
//           validatedForm = {
//             firstName: payload.firstName.trim(),
//             lastName: payload.lastName.trim(),
//             username: payload.username.trim(),
//             email: payload.email.trim(),
//             dob: payload.dob,
//             password: payload.password.trim()
//           };
//           fulfill({validatedForm});
//         }else{
//           reject(errors);
//         }
//     })
//   })
// }

// function validateLoginForm(payload){
//   const errors = {};
//   let isFormValid = true;
//   let message = '';

//   if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)){
//     isFormValid = false;
//     errors.email = 'The email provided is not valid.';
//   }

//   if(!payload ||  typeof payload.password !== 'string' || payload.password.trim().length < 8){
//     isFormValid = false;
//     errors.password = 'The password must have at least 8 characters.';
//   }

//   if(!isFormValid){
//     message = 'Check the form for errors.';
//   }

//   return {
//     success: isFormValid,
//     message,
//     errors
//   }
// }
