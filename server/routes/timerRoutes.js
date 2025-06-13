const express = require('express');
const router = express.Router();
const { getTimer, updateSettings, startSession, completeSession } = require('../controllers/timerController');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// @route   GET /api/timer
// @desc    Get user's timer settings and statistics
router.get('/', getTimer);

// @route   PUT /api/timer/settings
// @desc    Update timer settings
router.put('/settings', updateSettings);

// @route   POST /api/timer/session
// @desc    Start a new timer session
router.post('/session', startSession);

// @route   PUT /api/timer/session/:sessionId
// @desc    Complete a timer session
router.put('/session/:sessionId', completeSession);

module.exports = router; 