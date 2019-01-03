'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  imagePath: {
    type: String,
    default: 'https://vignette.wikia.nocookie.net/villainsfanon/images/f/ff/Unknown-1.jpg/revision/latest?cb=20170521020324'
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  },
  authToken: String,
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  eventWillAttempt: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  likedEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true //auto generation time of creation and last update
});

// eventSchema.pre('remove', async function (next) {
//   try {

//     var event = this;
//         await mongoose.model('Event').update({
//           createdEvent: event._id
//         }, {
//           $pull: {
//             createdEvent: event._id
//           }
//         }, {
//           multi: true
//         });

//     next();
//   } catch (err) {
//     next(err)
//   }
// });

module.exports = mongoose.model('User', userSchema);