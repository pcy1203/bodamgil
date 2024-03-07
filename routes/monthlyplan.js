const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isLoggedIn } = require('../middlewares');
const { renderMain, renderView, renderSelect, renderWrite,
	   writeMonthlyPlan, renderMonthlyPlan, deleteMonthlyPlan,
	   renderPlanDetail, updatePlanDetail, renderPlanDetailEdit,
	   updatePlanDetailCheck } = require('../controllers/monthlyplan');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더 생성');
  fs.mkdirSync('uploads');
}

try {
  fs.readdirSync('uploads/monthlyplan');
} catch (error) {
  console.error('monthlyplan 폴더 생성');
  fs.mkdirSync('uploads/monthlyplan');
}

const upload = multer({
  storage: multer.diskStorage({
	destination(req, file, cb) {
	  cb(null, 'uploads/monthlyplan');
	},
	filename(req, file, cb) {
	  const ext = path.extname(file.originalname);
	  cb(null, `user-${0}-monthlyplan_${Date.now()}${ext}`);
	},
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /myself/monthlyplan/view
router.get('/view', isLoggedIn, renderView);

// GET /myself/monthlyplan/select
router.get('/select', isLoggedIn, renderSelect);

// GET /myself/monthlyplan/write
router.get('/write', isLoggedIn, renderWrite);

// POST /myself/monthlyplan/write
router.post('/write', isLoggedIn, upload.single('image'), writeMonthlyPlan);

// PATCH /myself/monthlyplan/:id/:detailid/check
router.patch('/:id/:detailid/check', isLoggedIn, updatePlanDetailCheck);

// GET /myself/monthlyplan/:id/detail
router.get('/:id/detail', isLoggedIn, renderPlanDetail);

// GET /myself/monthlyplan/:id/edit
router.get('/:id/edit', isLoggedIn, renderPlanDetailEdit);

// PATCH /myself/monthlyplan/:id/detail
router.patch('/:id/edit', isLoggedIn, updatePlanDetail);

// GET /myself/monthlyplan/:id
router.get('/:id', isLoggedIn, renderMonthlyPlan);

// DELETE /myself/monthlyplan/:id
router.delete('/:id', isLoggedIn, deleteMonthlyPlan);

// GET /myself/monthlyplan
router.get('/', renderMain);

module.exports = router;