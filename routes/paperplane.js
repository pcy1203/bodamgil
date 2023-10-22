const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { renderMain, makeGlassBottleIfNotExist, renderGlassBottle, renderPaperPlane,
	   renderWrite, writePaperPlane, renderSuccess } = require('../controllers/paperplane');

const router = express.Router();

// GET /myself/paperplane/start
router.get('/start', isLoggedIn, makeGlassBottleIfNotExist);

// GET /myself/paperplane/:id/write/success
router.get('/:id/write/success', isLoggedIn, renderSuccess);

// GET /myself/paperplane/:id/write
router.get('/:id/write', isLoggedIn, renderWrite);

// POST /myself/paperplane/:id/write
router.post('/:id/write', isLoggedIn, writePaperPlane);

// GET /myself/paperplane/:id/view
router.get('/:id/view', isLoggedIn, renderPaperPlane);

// GET /myself/paperplane/:id
router.get('/:id', isLoggedIn, renderGlassBottle);

// GET /myself/paperplane
router.get('/', renderMain);

module.exports = router;