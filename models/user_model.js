'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
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
  hash:{
    type: String
  },
  registrationDate:{
    type: Date,
    default: Date.now
  },
  dob:{
    type: Date,
    required: true
  },
  connections: {
    type: [String],
    default: []
  },
  blackList: {
    type: [String],
    default: []
  },
  createdPosts: {
    type: [String],
    default: []
  },
  likedPosts:{
    type: [String],
    default: []
  }
})

UserSchema.methods.comparePasswords = function(password){
  return (password) ? bcrypt.compareSync(password, this.hash) : false;
};

//Seems to produce problem if required to change the schema at a later date
//mongoose.model('User', UserSchema);

module.exports = UserSchema;
