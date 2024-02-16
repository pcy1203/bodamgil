const express = require('express');
// const { isLoggedIn } = require('../middlewares');
const { renderMain, renderView, renderSelect, renderWrite,
	   writeMonthlyPlan, renderMonthlyPlan, deleteMonthlyPlan,
	   renderPlanDetail, updatePlanDetail } = require('../controllers/monthlyplan');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  next();
};  // 개발의 편의를 위해 임시적으로 로그인하지 않은 상태 허용 (추후 지우기)

// GET /myself/monthlyplan/view
router.get('/view', isLoggedIn, renderView);

// GET /myself/monthlyplan/select
router.get('/select', isLoggedIn, renderSelect);

// GET /myself/monthlyplan/write
router.get('/:month/write', isLoggedIn, renderWrite);

// POST /myself/monthlyplan/write
router.post('/:month/write', isLoggedIn, writeMonthlyPlan);

// GET /myself/monthlyplan/:id/detail
router.get('/:id/detail', isLoggedIn, renderPlanDetail);

// GET /myself/monthlyplan/:id/detail
router.patch('/:id/detail', isLoggedIn, updatePlanDetail);

// GET /myself/monthlyplan/:id
router.get('/:id', isLoggedIn, renderMonthlyPlan);

// DELETE /myself/monthlyplan/:id
router.delete('/:id', isLoggedIn, deleteMonthlyPlan);

// GET /myself/monthlyplan
router.get('/', renderMain);

module.exports = router;