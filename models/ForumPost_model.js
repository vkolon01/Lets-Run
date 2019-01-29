'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  text_area: {
    type: String,
    trim: true,
    required: true
  },
  visitsCount: {
    type: Number,
    default: 0
  },
  postComment: {
    type: chema.Types.ObjectId,
    ref: 'ForumComments'
  },
  username: {
    type: chema.Types.ObjectId,
    ref: 'ForumPost'
  },
  username: {
    type: chema.Types.ObjectId,
    ref: 'User'
  }
  },{
  timestamps: true
});

module.exports = mongoose.model('ForumPost', userSchema);