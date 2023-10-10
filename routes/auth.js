const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, logout, signup } = require('../controllers/auth');

const router = express.Router();

// POST /login
router.post('/login', isNotLoggedIn, login);

// GET /logout
router.get('/logout', isLoggedIn, logout);

// POST /signup
router.post('/signup', isNotLoggedIn, signup);

// GET /kakao
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/result', passport.authenticate('kakao', {
  failureRedirect: '/login?message=kakaoError',
}), (req, res) => {
  res.redirect('/');
});

// GET /google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/result', passport.authenticate('google', {
  failureRedirect: '/login?message=googleError',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;