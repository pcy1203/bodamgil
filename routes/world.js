const express = require('express');
const { renderMain } = require('../controllers/world');

const router = express.Router();

// /world
router.get('/', renderMain);

module.exports = router;