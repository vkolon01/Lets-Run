'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachedEvent = require('./event_model');

var PostSchema = new Schema({
  message: String,
  author_id: {
    type: String,
    required: true,
    trim: true
  },
  postDate: {
    type: Date,
    default: Date.now()
  },
  attachedEvent:{
    type: String,
    default: null
  },
  comments: [String],
  likes: {
    type: [String],
    default: []
  }
});

module.exports = PostSchema;
