'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
  content: {
    type: String,
    trim: true,
    required: true
  },
  quote: {
    content: String,
    quoteAuthor: String
  },
  forumPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  },{
  timestamps: true
});

//*********************************************************** */
  //            MIDDLEWARE REMOVE COMMENT FOR POST REF TO THIS COMMENT IN USER
  // ************************************************************

  userSchema.pre('remove', async function (next) {
    try {

      var postComment = this;

          await mongoose.model('Post').update({
            postComments: postComment._id
          }, {
            $pull: {
              postComments: postComment._id
            }
          }, {
            multi: true
          });         

      next();
    } catch (err) {
      next(err)
    }
  });

module.exports = mongoose.model('PostComment', userSchema);