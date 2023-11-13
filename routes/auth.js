const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login, logout, signup, setprofile, changepassword,
	    findid, findpassword, setpassword, unregister } = require('../controllers/auth');

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
	  cb(null, `user-${req.user.dataValues.id}_${Date.now()}${ext}`);
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
router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get('/kakao/result', passport.authenticate('kakao', {
  failureRedirect: '/login?message=kakaoError',
}), (req, res) => {
  if (!req.user.name || !req.user.gender || !req.user.birthDate) {
	req.session.redirectURL = req.user.redirectURL;
	req.user.redirectURL = null;
    res.redirect('/setprofile');
  } else if (req.user.redirectURL) {
	const redirectUrl = req.user.redirectURL;
	req.user.redirectURL = null;
	return res.redirect(redirectUrl);
  } else {
	return res.redirect("/");
  }
});

// GET /auth/google
router.get('/google', isNotLoggedIn, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/result', passport.authenticate('google', {
  failureRedirect: '/login?message=googleError',
}), (req, res) => {
  if (!req.user.name || !req.user.gender || !req.user.birthDate) {
	req.session.redirectURL = req.user.redirectURL;
	req.user.redirectURL = null;
    return res.redirect('/setprofile');
  } else if (req.user.redirectURL) {
	const redirectUrl = req.user.redirectURL;
	req.user.redirectURL = null;
	return res.redirect(redirectUrl);
  } else {
	return res.redirect("/");
  }
});

// POST /auth/setprofile
router.post('/setprofile', isLoggedIn, upload.single('image'), setprofile);

// POST /auth/changepassword
router.post('/changepassword', isLoggedIn, changepassword);

// POST /auth/findid
router.post('/findid', isNotLoggedIn, findid);

// POST /auth/findpassword
router.post('/findpassword', isNotLoggedIn, findpassword);

// POST /auth/setpassword
router.post('/setpassword', isNotLoggedIn, setpassword);

// GET /auth/unregister
router.get('/unregister', isLoggedIn, unregister);

module.exports = router;