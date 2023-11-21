const express = require('express');
const { renderMain, renderSite } = require('../controllers/world');

const router = express.Router();

// /world/site
router.get('/site', renderSite);

// /world
router.get('/', renderMain);

module.exports = router;