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
  content: {
    type: String,
    trim: true,
    required: true
  },
  visitsCount: {
    type: Number,
    default: 0
  },
  postComments: [{
    type: Schema.Types.ObjectId,
    ref: 'ForumComments'
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'ForumCategory'
  }
  },{
  timestamps: true
});

module.exports = mongoose.model('ForumPost', userSchema);