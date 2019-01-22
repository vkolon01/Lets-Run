'use strict';
///////////////////////////////////////////////////////
//              LOGIN USER
///////////////////////////////////////////////////////
exports.loginRequired = function(req, res, next){
  if(req.user){
    next();
  }else{
    return res.status(401).json({ message: "Please Log in to continue"});
    
  }
}
///////////////////////////////////////////////////////
//              CHECK OWNERSHIP
///////////////////////////////////////////////////////
exports.checkOwnership = function (req, res, next){
  if(req.user){
    next();
  }else{
    return res.status(401).json({ message: "You are not authorized to perform this action"});
  }
}
