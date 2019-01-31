'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  visitsCount: {
    type: Number,
    default: 0
  },
  postComments: [{
    type: Schema.Types.ObjectId,
    ref: 'forumPost_Comment'
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'ForumCategory'
  }
  },{
  timestamps: true
});

//*********************************************************** */
  //            MIDDLEWARE REMOVE EVENT REF TO THIS EVENT IN USER
  // ************************************************************

  userSchema.pre('remove', async function (next) {
    try {

      var post = this;

          await mongoose.model('User').update({
            createdPosts: post._id
          }, {
            $pull: {
              createdPosts: post._id
            }
          }, {
            multi: true
          });         

      next();
    } catch (err) {
      next(err)
    }
  });

module.exports = mongoose.model('ForumPost', userSchema);