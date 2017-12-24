'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttachedEvent = new Schema({
  picture: {
    type: String,
    default: null
  },
  eventDate: {
    type: String,
    default: "Flexible"
  },
  location: String,
  distance: String,
  pace: String,
  runners: {
    type: [String],
    default: []
  }
});

module.exports = AttachedEvent;
