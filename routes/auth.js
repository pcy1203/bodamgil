const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, logout, signup, setprofile } = require('../controllers/auth');

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
	  const ext = path.extname(file.originalname);
	  if (req.user && req.user.dataValues.provider !== 'local') {
		cb(null, `${req.user.dataValues.provider}-user-${req.user.dataValues.id}_${Date.now()}${ext}`);
	  } else {
		cb(null, `${req.body.email}_${Date.now()}${ext}`);
	  }
	},
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// POST /auth/signup
router.post('/signup', isNotLoggedIn, upload.single('image'), signup);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/result', passport.authenticate('kakao', {
  failureRedirect: '/login?message=kakaoError',
}), (req, res) => {
  if (!req.user.introduction) {
    res.redirect('/setprofile');
  } else {
	res.redirect('/');
  }
});

// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/result', passport.authenticate('google', {
  failureRedirect: '/login?message=googleError',
}), (req, res) => {
  if (!req.user.introduction) {
    res.redirect('/setprofile');
  } else {
	res.redirect('/');
  }
});

// POST /auth/setprofile
router.post('/setprofile', isLoggedIn, upload.single('image'), setprofile);

module.exports = router;