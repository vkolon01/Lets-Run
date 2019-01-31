'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  imagePath: {
    type: String,
    default: 'https://vignette.wikia.nocookie.net/villainsfanon/images/f/ff/Unknown-1.jpg/revision/latest?cb=20170521020324'
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  },
  authToken: String,
  resetToken: String,
  resetTokenExpiration: Date,
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  eventWillAttempt: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  likedEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  invitesToPrivateEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'ForumPost'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);