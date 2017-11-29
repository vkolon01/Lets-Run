'use strict'
var sinon = require('sinon');
var User = require('./users');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

/*
describe('User module', ()=>{
  describe('"up"',()=>{
    it('should export a function', ()=>{
      expect(User.up).to.be.a('function')
    }),
    it('should return a Promise', ()=>{
      const usersUpResult = User.up()
      expect(usersUpResult.then).to.be.a('function')
      expect(usersUpResult.catch).to.be.a('function')
    })
  })
})
*/
