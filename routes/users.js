var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');
const authCheck = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const { body } = require('express-validator/check');
const User = require('../models/user_model');



router.post('/register',   [
    body('email')
    .trim()
    .isEmail()
    .normalizeEmail({all_lowercase: true})
    // .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-Mail address already exists!');
        }
      });
    }),

    body('password')
      .trim()
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage('Please enter a password with numbers and letters.'),

      body('firstName')
      .trim()
      .withMessage('Please enter a firstname'),

      body('lastName')
      .trim()
      .withMessage('Please enter a lastname'),

      body('username')
      .trim()
      .withMessage('Please enter a username'),
  ],  userHandler.register);

router.post('/sign_in', [
  body('email')
  .trim()
  .isEmail()
  .normalizeEmail({all_lowercase: true}),

  body('password')
    .trim()
    .isAlphanumeric()
    .withMessage('Please enter a password with numbers and letters.')
], userHandler.sign_in);

router.get('/:user_id', authCheck,  userHandler.getUserProfile);

router.delete('/:user_id/delete_user', authCheck, userHandler.deleteUser);

router.get('/:user_id/freind_manipulation',authCheck,  userHandler.followPersonController);

router.put('/add_avatar', authCheck, extractFile, userHandler.add_avatar);
  
module.exports = router;
