var mongoose = require('mongoose');
var AttachedEvent = mongoose.model("Events",require('../models/event_model'));
var UserController = require('./userController');
var constants = require('../constants/messages');
var async = require('async');

exports.getRunners = function(req,res){
  var event_id = req.params.event_id;
  var response = [];
  AttachedEvent.findById(event_id,function(err,event){
    if(err) res.send(constants.errors.genericError);
    if(event){
      async.forEach(event.runners,function(runner_id,callback){
        UserController.getUser(runner_id).then(function(runner){
          response.push(runner);
          callback()
        },function(err){
          callback(err);
        })
      },function(err){
        if(err) res.status(500).send(err);
        res.send(response);
      })
    }else{
      res.status(500).send(constants.errors.genericError);
    }
  })
}

exports.attendEvent = function(req,res){
  var event_id = req.params.event_id;
  var user_id = req.user._id
  AttachedEvent.findById(event_id,function(err,event){
    if(err) res.send(constants.errors.genericError)
    if(event){
      console.log(event.runners)
      if(!event.runners.includes(user_id)){
        event.runners.push(user_id);
        event.save(function(err){
          if(err) res.status(500).send(constants.errors.genericError);
        })
        res.send(constants.success.eventAttended);
      }else{
        event.runners.splice(event.runners.indexOf(user_id),1);
        event.save(function(err){
          if(err) res.status(500).send(constants.errors.genericError);
        })
        res.send(constants.success.attendanceCancelled);
      }
    }
  })
}
