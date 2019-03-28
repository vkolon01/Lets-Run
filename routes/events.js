var express = require('express');
var router = express.Router();
var EventController = require('../controllers/eventController');
var AuthController = require('../controllers/authController');
var CommentController = require('../controllers/commentController');
const authCheck = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const { body } = require('express-validator/check');

//////////////      EVENT CONTROLLERS 

router.get('/', EventController.getEvents);

router.get('/get_event_for_home_component', EventController.getEventsForHomeComponent);

router.put('/:event_id', [
    body('location')
    .trim()
    .withMessage('Please enter a location'),

    body('distance')
    .trim()
    .withMessage('Please enter a distance'),

    body('pace')
    .trim()
    .withMessage('Please enter a pace')
], authCheck, extractFile, EventController.updateEvent);

router.get('/:event_id', authCheck, EventController.getEvent);

router.post('/add-event',[
    body('location')
    .trim()
    .withMessage('Please enter a location'),

    body('distance')
    .trim()
    .withMessage('Please enter a distance'),

    body('pace')
    .trim()
    .withMessage('Please enter a pace')
], authCheck, extractFile, EventController.addEvent);

router.delete('/:event_id', authCheck, EventController.deleteEvent);

router.post('/:event_id/invitesToEvent', authCheck, EventController.sendInvitesToTheFriends);

router.get('/:event_id/invitedUsers', authCheck, EventController.getInvitedUsersForPrivateEvent);

//////////////////////// CONTROLLERS FOR EVENT LIKES AND FOLLOWING

router.get('/:event_id/like_event_switcher', authCheck, EventController.eventLikeSwitcher);

router.get('/:event_id/participate_at_event', authCheck, EventController.participateAtEvent);

///////////////////////// CONTOLLERS FOR EVENT COMMENTS

router.get('/:event_id/get_comments', CommentController.getCommnentsForEvent);

router.post('/:event_id/add_comment',[
    body('content')
    .trim()
    .withMessage('Check content')
], authCheck, CommentController.addCommentToEvent);

router.put('/reply_to_comment/:event_id', authCheck, CommentController.replyToComment);

router.put('/:event_id/:comment_id',[
    body('content')
    .trim()
    .withMessage('Check content')
], authCheck, CommentController.editComment);

router.delete('/:event_id/:comment_id', authCheck, CommentController.DeleteEventComment);

module.exports = router;
