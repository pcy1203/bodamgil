const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isLoggedIn } = require('../middlewares');
const { renderMain, renderPolaroid, renderWrite, writePolaroid } = require('../controllers/polaroid');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더 생성');
  fs.mkdirSync('uploads');
}

try {
  fs.readdirSync('uploads/polaroid');
} catch (error) {
  console.error('polaroid 폴더 생성');
  fs.mkdirSync('uploads/polaroid');
}

const upload = multer({
  storage: multer.diskStorage({
	destination(req, file, cb) {
	  cb(null, 'uploads/polaroid');
	},
	filename(req, file, cb) {
	  const ext = path.extname(file.originalname);
	  cb(null, `${req.user.dataValues.id}_${Date.now()}${ext}`);
	},
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /myself/polaroid/write
router.get('/write', isLoggedIn, renderWrite);

// POST /myself/polaroid/write
router.post('/write', isLoggedIn, upload.single('image'), writePolaroid);

// TODO - URL을 공유한다면 id를 숫자 말고 암호로 만들기
// GET /myself/polaroid/:id
router.get('/:id', isLoggedIn, renderPolaroid);

// GET /myself/polaroid
router.get('/', renderMain);

module.exports = router;