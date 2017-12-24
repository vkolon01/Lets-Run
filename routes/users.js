var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');
var feedController = require('../controllers/feedController');

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

router.route('/:user_id')
  .get(userHandler.getUserProfile);

router.route('/:user_id/posts')
  .get(feedController.getPostsById);

router.route('/:user_id/avatar')
  .post()
  
module.exports = router;
