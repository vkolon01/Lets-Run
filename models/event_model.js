'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  picture: {
    type: String,
    default: null
  },
  eventDate: {
    type: Date
  },
  location: String,
  distance: Number,
  pace: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [
    {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  runners: [
    {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
},
{
  timestamps: true //auto generation time of creation and last update
});

// module.exports = AttachedEvent;
module.exports = mongoose.model('Event', eventSchema);
