var express = require('express');
var router = express.Router();
var EventController = require('../controllers/eventController');
var AuthController = require('../controllers/authController');
var CommentController = require('../controllers/commentController');
const authCheck = require('../middleware/check-auth');


router.get('/', EventController.getEvents);

router.post('/add-event' ,authCheck, EventController.addEvent);

router.get('/:event_id', EventController.getEvent);

router.delete('/:event_id', authCheck, EventController.deleteEvent);

router.put('/:event_id', authCheck, EventController.updateEvent);



router.get('/:event_id/get_comments', CommentController.getCommnentsForEvent);

router.post('/:event_id/add_comment', authCheck, CommentController.addCommentToEvent);

router.put('/:event_id/:comment_id', authCheck, CommentController.editComment);

router.delete('/:event_id/:comment_id', authCheck, CommentController.DeleteEventComment);





module.exports = router;
