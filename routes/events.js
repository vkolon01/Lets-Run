var express = require('express');
var router = express.Router();
var EventController = require('../controllers/eventController');
var AuthController = require('../controllers/authController');

router.route('/:event_id')
  .get(EventController.getRunners)
  .put(AuthController.loginRequired,EventController.attendEvent)

  module.exports = router;
