var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/register')
  .all(function(req,res,next){
    next();
  })
  .post(userHandler.register);

router.route('/sign_in')
  .post(userHandler.sign_in);

module.exports = router;
