  'use strict'

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var Comment = require('./comment_model');
  var User = require('./user_model');

  var eventSchema = new Schema({
    picture: {
      type: String,
      default: null
    },
    eventDate: {
      type: Date
    },
    location: {
      type: String,
      required: true
    },
    distance: {
      type: String,
      required: true
    },
    pace: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    runners: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  }, {
    timestamps: true //auto generation time of creation and last update
  });

  //*********************************************************** */
  //            MIDDLEWARE REMOVE EVENT REF TO THIS EVENT IN USER
  // ************************************************************

  eventSchema.pre('remove', async function (next) {
    try {

      var event = this;
          await mongoose.model('User').update({
            createdEvent: event._id
          }, {
            $pull: {
              createdEvent: event._id
            }
          }, {
            multi: true
          });

      next();
    } catch (err) {
      next(err)
    }
  });

  module.exports = mongoose.model('Event', eventSchema);