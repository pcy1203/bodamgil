const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderLogin, renderSignup, renderMyProfile, renderSetProfile,
	   renderChangePassword } = require('../controllers/main');

const router = express.Router();

// GET /login
router.get('/login', isNotLoggedIn, renderLogin);

// GET /signup
router.get('/signup', isNotLoggedIn, renderSignup);

// GET /myprofile
router.get('/myprofile', isLoggedIn, renderMyProfile);

// GET /setprofile
router.get('/setprofile', isNotLoggedIn, renderSetProfile);

// GET /changepassword
router.get('/changepassword', isLoggedIn, renderChangePassword);

// GET /
router.get('/', renderMain);

module.exports = router;