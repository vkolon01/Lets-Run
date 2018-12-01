'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName:{
    type: String,
    trim: true,
    required: true
  },
  imagePath: { type: String, default: 'https://vignette.wikia.nocookie.net/villainsfanon/images/f/ff/Unknown-1.jpg/revision/latest?cb=20170521020324'},
  username:{
    type:String,
    unique: true,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob:{
    type: Date,
    required: true
  },
  friendList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  blackList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdEvent: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  likedEvent:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  comment:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
},
{
  timestamps: true //auto generation time of creation and last update
})

// UserSchema.methods.comparePasswords = function(password){
//   return (password) ? bcrypt.compareSync(password, this.hash) : false;
// };

//Seems to produce problem if required to change the schema at a later date
//mongoose.model('User', UserSchema);

// module.exports = UserSchema;
module.exports = mongoose.model('User', userSchema);

