'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachedEvent = require('./event_model');

var CommentSchema = new Schema({
  message: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true //auto generation time of creation and last update
});

module.exports = CommentSchema;
// module.exports = mongoose.model('Comment', commentSchema);
