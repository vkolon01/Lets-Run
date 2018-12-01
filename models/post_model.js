'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachedEvent = require('./event_model');

var PostSchema = new Schema({
  message: String,
  author: {
    type: String,
    required: true,
    trim: true
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
},
{
  timestamps: true //auto generation time of creation and last update
});

module.exports = PostSchema;
// module.exports = mongoose.model('Post', postSchema);

