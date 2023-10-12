const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path =require('path');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, logout, signup } = require('../controllers/auth');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더 생성');
  fs.mkdirSync('uploads');
}

try {
  fs.readdirSync('uploads/profile');
} catch (error) {
  console.error('profile 폴더 생성');
  fs.mkdirSync('uploads/profile');
}

const upload = multer({
  storage: multer.diskStorage({
	destination(req, file, cb) {
	  cb(null, 'uploads/profile');
	},
	filename(req, file, cb) {
	  // TODO - 데이터 저장 방식 고민하기 (현재 이메일 의존)
	  const ext = path.extname(file.originalname);
	  cb(null, `${req.body.email}_${Date.now()}${ext}`);
	},
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /login
router.post('/login', isNotLoggedIn, login);

// GET /logout
router.get('/logout', isLoggedIn, logout);

// POST /signup
router.post('/signup', isNotLoggedIn, upload.single('image'), signup);

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