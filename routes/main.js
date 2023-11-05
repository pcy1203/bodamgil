const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderLogin, renderSignup, renderSignupSuccess, renderMyProfile, renderSetProfile,
	   renderChangePassword, renderAbout, renderNotice, renderFaq } = require('../controllers/main');

const router = express.Router();

// GET /login
router.get('/login', isNotLoggedIn, renderLogin);

// GET /signup
router.get('/signup', isNotLoggedIn, renderSignup);

// GET /signupsuccess
router.get('/signupsuccess', isNotLoggedIn, renderSignupSuccess);

// GET /myprofile
router.get('/myprofile', isLoggedIn, renderMyProfile);

// GET /setprofile
router.get('/setprofile', isLoggedIn, renderSetProfile);

// GET /changepassword
router.get('/changepassword', isLoggedIn, renderChangePassword);

// GET /about
router.get('/about', renderAbout);

// GET /notice
router.get('/notice', renderNotice);

// GET /faq
router.get('/faq', renderFaq);

// GET /
router.get('/', renderMain);

module.exports = router;