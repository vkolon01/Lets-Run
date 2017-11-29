'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttachedEvent = new Schema({
  picture: {
    type: String,
    default: null
  },
  eventDate: Date,
  location: String,
  distance: String,
  runners: []
});

module.exports = AttachedEvent;
