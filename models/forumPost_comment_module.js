'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
  content: {
    type: String,
    trim: true,
    required: true
  },
  quote: {
    type: String
  },
  forumPost: {
    type: chema.Types.ObjectId,
    ref: 'ForumPost'
  },
  author: {
    type: chema.Types.ObjectId,
    ref: 'User'
  }
  },{
  timestamps: true
});

module.exports = mongoose.model('forumPost_Comment', userSchema);