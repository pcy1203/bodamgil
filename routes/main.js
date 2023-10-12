const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderLogin, renderSignup, renderMyProfile, renderSetProfile,
	   renderChangePassword, renderAbout } = require('../controllers/main');

const router = express.Router();

// GET /login
router.get('/login', isNotLoggedIn, renderLogin);

// GET /signup
router.get('/signup', isNotLoggedIn, renderSignup);

// GET /myprofile
router.get('/myprofile', isLoggedIn, renderMyProfile);

// GET /setprofile
router.get('/setprofile', isLoggedIn, renderSetProfile);

// GET /changepassword
router.get('/changepassword', isLoggedIn, renderChangePassword);

// GET /about
router.get('/about', renderAbout);

// GET /
router.get('/', renderMain);

module.exports = router;