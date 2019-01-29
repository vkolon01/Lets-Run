var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/userController');
const authCheck = require('../middleware/check-auth');
const { body } = require('express-validator/check');
const User = require('../models/user_model');


router.get('/get_sections', );
router.post('/add_section', );
router.put('/:category_id', );
router.post('/:category_id', );









module.exports = router;