const express = require('express');
const { renderMain } = require('../controllers/main');

const router = express.Router();

// GET /
router.get('/', renderMain);

module.exports = router;