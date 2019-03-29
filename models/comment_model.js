'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Event = require('./event_model');
var User = require('./user_model');


var commentSchema = new Schema({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' }, 
  reported: {
    status: {
      type: Boolean,
      default: false
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    dateOfReport: Date
  },
  quote: {
    content: String,
    quoteAuthor: String
  },
},
{
  timestamps: true //auto generation time of creation and last update
});


commentSchema.pre('remove', async function (next) {
  
  var comment = this;

  
  try {

    await mongoose.model('Event').update({
      comments: comment._id
    }, {
      $pull: {
        comments: comment._id
      }
    });

    console.log('MIDDLEWARE REMOVE 1');

    await mongoose.model('User').update({
      comment: comment._id
    }, {
      $pull: {
        comment: comment._id
      }
    });

    console.log('MIDDLEWARE REMOVE 2');

   next();
  } catch (err) {
    console.log('err');

    console.log(err);

    next(err)
  }
})

// commentSchema.pre('remove', async function (next) {
//   try {
//     var comment = this;
//     await Event.update({
//       comments: comment._id
//     }, {
//       $pull: {
//         comments: comment._id
//       }
//     }, {
//       multi: true
//     });
//     console.log('MIDDLEWARE REMOVE 2');
//      next();
//   } catch (err) {
//     next(err)
//   }
// })




module.exports = mongoose.model('Comment', commentSchema);






// Hello to everyone, i'm first time asking on forums so if doing something wrong, sorry.  I'm implementing mongoose shema with pre() middleware, and stuck at one point, i have 3 models, User - Comment - Event, on deleting comment i am deleting refs to comment from User and Event, Deleting from User working perfect, but for Event returns me error update is not a function, but it's same as user and i have stuck, maybe someone will see where is my fault