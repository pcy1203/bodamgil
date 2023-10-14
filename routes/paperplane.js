const express = require('express');
const { renderMain } = require('../controllers/paperplane');

const router = express.Router();

// GET /myself/paperplane
router.get('/', renderMain);

module.exports = router;