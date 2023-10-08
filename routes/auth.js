const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, logout, signup } = require('../controllers/auth');

const router = express.Router();

// POST /login
router.post('/login', isNotLoggedIn, login);

// GET /logout
router.get('/logout', isLoggedIn, logout);

// POST /signup
router.post('/signup', isNotLoggedIn, signup);

module.exports = router;