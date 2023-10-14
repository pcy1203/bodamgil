const express = require('express');
const { renderMain } = require('../controllers/polaroid');

const router = express.Router();

// GET /myself/polaroid
router.get('/', renderMain);

module.exports = router;