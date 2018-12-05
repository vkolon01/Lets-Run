var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');
const authCheck = require('../middleware/check-auth');

/* GET users listing. */
// router.get('/', );

router.post('/register', userHandler.register);

router.post('/sign_in', userHandler.sign_in);

router.get('/:user_id',authCheck,  userHandler.getUserProfile);

router.delete('/:user_id/delete_user', authCheck, userHandler.deleteUser);

router.post('/:user_id/avatar');
  
module.exports = router;
