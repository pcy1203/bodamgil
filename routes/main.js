const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderLogin, renderSignup } = require('../controllers/main');

const router = express.Router();

// GET /login
router.get('/login', isNotLoggedIn, renderLogin);

// GET /signup
router.get('/signup', isNotLoggedIn, renderSignup);

// GET /
router.get('/', renderMain);

module.exports = router;