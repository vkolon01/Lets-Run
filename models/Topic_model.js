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
  visitsCount: {
    type: Number,
    default: 0
  },
  forumCategory: {
    type: String,
    required: true
  },
  forOwnersOnly: {
    type: Boolean,
    default: false
  },
  lastComment: {
    post: {
      postName: String,
      postId: String
    },
    userName: String,
    date: Date
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
  },{
  timestamps: true
});

module.exports = mongoose.model('Topic', userSchema);