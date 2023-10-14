const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { renderMain, renderPolaroid, renderWrite, writePolaroid } = require('../controllers/polaroid');

const router = express.Router();

// GET /myself/polaroid/write
router.get('/write', isLoggedIn, renderWrite);

// POST /myself/polaroid/write
router.post('/write', isLoggedIn, writePolaroid);

// GET /myself/polaroid/:id
router.get('/:id', isLoggedIn, renderPolaroid);

// GET /myself/polaroid
router.get('/', renderMain);

module.exports = router;