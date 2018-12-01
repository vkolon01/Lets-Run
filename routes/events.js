var express = require('express');
var router = express.Router();
var EventController = require('../controllers/eventController');
var AuthController = require('../controllers/authController');
const authCheck = require('../middleware/check-auth');


router.get('/', EventController.getEvents);

router.post('/add-event' ,authCheck, EventController.addEvent);

router.get('/:event_id', EventController.getEvent);

router.delete('/:event_id', authCheck, EventController.deleteEvent);

router.put('/:event_id', authCheck, EventController.updateEvent);




module.exports = router;
