var express = require('express');
var router = express.Router();
var EventController = require('../controllers/eventController');
var AuthController = require('../controllers/authController');
var CommentController = require('../controllers/commentController');
const authCheck = require('../middleware/check-auth');
const extractFile = require('../middleware/file');


router.get('/', EventController.getEvents);

router.put('/:event_id', authCheck, extractFile, EventController.updateEvent);

router.get('/:event_id', authCheck, EventController.getEvent);

router.post('/add-event' ,authCheck, extractFile, EventController.addEvent);

router.delete('/:event_id', authCheck, EventController.deleteEvent);

router.get('/:event_id/like_event_switcher', authCheck, EventController.eventLikeSwitcher);
router.get('/:event_id/participate_at_event', authCheck, EventController.participateAtEvent);


router.get('/:event_id/get_comments', CommentController.getCommnentsForEvent);

router.post('/:event_id/add_comment', authCheck, CommentController.addCommentToEvent);

router.put('/:event_id/:comment_id', authCheck, CommentController.editComment);

router.delete('/:event_id/:comment_id', authCheck, CommentController.DeleteEventComment);







module.exports = router;
