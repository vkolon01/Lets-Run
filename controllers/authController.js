'use strict';

exports.loginRequired = function(req, res, next){
  console.log(res.user);
  if(req.user){
    next();
  }else{
    return res.status(401).json({ message: "Please Log in to continue"});
  }
}

exports.checkOwnership = function (req, res, next){
  console.log(req.user);
  if(req.user){
    next();
  }else{
    return res.status(401).json({ message: "You are not authorized to perform this action"});
  }
}
