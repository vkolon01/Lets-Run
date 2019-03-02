var express = require('express');
var router = express.Router();
var MessageController = require('../controllers/messagesController');

router.post('/contactUs' ,MessageController.contactUsMessage);



module.exports = router;