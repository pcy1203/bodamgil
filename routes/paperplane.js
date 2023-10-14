const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { renderMain, renderGlassBottle, renderPaperPlane, renderWrite, writePaperPlane } = require('../controllers/paperplane');

const router = express.Router();

// GET /myself/paperplane/write
router.get('/write', isLoggedIn, renderWrite);

// POST /myself/paperplane/write
router.post('/write', isLoggedIn, writePaperPlane);

// GET /myself/paperplane/:id/view
router.get('/:id/view', isLoggedIn, renderPaperPlane);

// GET /myself/paperplane/:id
router.get('/:id', isLoggedIn, renderGlassBottle);

// GET /myself/polaroid
router.get('/', renderMain);

module.exports = router;