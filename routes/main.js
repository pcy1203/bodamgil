const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderLogin, renderSignup, renderSignupSuccess, renderMyProfile, renderSetProfile,
	   renderChangePassword, renderFindId, renderFindIdSuccess, renderFindPassword, renderSetPassword,
	   renderAbout, renderNotice, renderFaq } = require('../controllers/main');

const router = express.Router();

// GET /login
router.get('/login', isNotLoggedIn, renderLogin);

// GET /signup
router.get('/signup', isNotLoggedIn, renderSignup);

// GET /signup/success
router.get('/signup/success', isNotLoggedIn, renderSignupSuccess);

// GET /myprofile
router.get('/myprofile', isLoggedIn, renderMyProfile);

// GET /setprofile
router.get('/setprofile', isLoggedIn, renderSetProfile);

// GET /changepassword
router.get('/changepassword', isLoggedIn, renderChangePassword);

// GET /findid
router.get('/findid', isNotLoggedIn, renderFindId);

// GET /findid/success
router.get('/findid/success', isNotLoggedIn, renderFindIdSuccess);

// GET /findpassword
router.get('/findpassword', isNotLoggedIn, renderFindPassword);

// GET /setpassword/:id
router.get('/setpassword/:id', isNotLoggedIn, renderSetPassword);

// GET /about
router.get('/about', renderAbout);

// GET /notice
router.get('/notice', renderNotice);

// GET /faq
router.get('/faq', renderFaq);

// GET /
router.get('/', renderMain);

module.exports = router;