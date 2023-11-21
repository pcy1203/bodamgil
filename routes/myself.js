const express = require('express');
const polaroidRouter = require('./polaroid');
const paperplaneRouter = require('./paperplane');
const { renderMain, renderGame, renderTest } = require('../controllers/myself');

const router = express.Router();

// /myself/polaroid
router.use('/polaroid', polaroidRouter);

// /myself/paperplane
router.use('/paperplane', paperplaneRouter);

// /myself/game
router.get('/game', renderGame);

// /myself/test
router.get('/test', renderTest);

// /myself
router.get('/', renderMain);

module.exports = router;