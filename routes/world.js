const express = require('express');
const { renderMain, renderDuty, renderJob, renderSite } = require('../controllers/world');

const router = express.Router();

// /world/duty
router.get('/duty', renderDuty);

// /world/job
router.get('/job', renderJob);

// /world/site
router.get('/site', renderSite);

// /world
router.get('/', renderMain);

module.exports = router;