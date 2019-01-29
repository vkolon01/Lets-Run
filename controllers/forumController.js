const {
    validationResult
  } = require('express-validator/check');
  var constants = require('../constants/messages');
  var htmlTemplates = require('../constants/htmlTemplateForEmail');
  const quotes = require('../constants/emailQuotesArray');
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

///////////////////////////////////////////////////////
//              GET CATEGORY LIST
///////////////////////////////////////////////////////

