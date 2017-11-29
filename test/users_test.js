var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

require('../models/users');
var Users = mongoose.model('User');

describe("Create a new user",function(){
  const goodForm = {
    firstName: "Name",
    lastName: "LName",
    userName: "username",
    email: "email@email.co.uk",
    password: "somepassword"
  }
  const badForm = {
    firstName: "Name",
    lastName: "LName",
    userName: "username",
    password: "somepassword"
  }

  it("should create new user",function(done){
    done();
  })
  it("should not create new user",function(done)){
    done();
  }
});
describe("comparePasswords",function(){
  it("should return true",function(done){
    done();
  });
  it("should return false",function(done){
    done();
  })
})
