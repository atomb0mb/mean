const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// create an account
router.post('/signup', UserController.createrUser);

// log into an account
router.post('/login', UserController.userLogin);
module.exports = router;