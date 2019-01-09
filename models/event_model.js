  'use strict'

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var Comment = require('./comment_model');
  var User = require('./user_model');

  var eventSchema = new Schema({
    picture: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511536830243-d4cf5a1ebfca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1689&q=80'
    },
    eventDate: {
      type: Date
    },
    description: {
      type: String,
      required: true,
      default: 'No description yeat added'  //http://localhost:8080/images/manchester-1544911854844.jpg
    },
    title: {
      type: String,
      required: true,
      default: "No title entered"
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
      ref: 'User', 
      require: true
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

          await mongoose.model('User').update({
            likedEvent: event._id
          }, {
            $pull: {
              likedEvent: event._id
            }
          }, {
            multi: true
          });

          await mongoose.model('User').update({
            eventWillAttempt: event._id
          }, {
            $pull: {
              eventWillAttempt: event._id
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