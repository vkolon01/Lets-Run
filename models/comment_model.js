'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachedEvent = require('./event_model');

var CommentSchema = new Schema({
  message: String,
  parent_id: String,
  author_id: {
    type: String,
    required: true,
    trim: true
  },
  author: Object,
  postDate: {
    type: Date,
    default: Date.now()
  },
});

module.exports = CommentSchema;
