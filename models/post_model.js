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
  AttachedEvent:{
    type: String,
    default: null
  },
  comments: [
    {
      author_id:{
        type: String,
        required: true
      },
      postDate: {
        type: Date,
        default: Date.now()
      },
      body: String
    }]
});

module.exports = PostSchema;
