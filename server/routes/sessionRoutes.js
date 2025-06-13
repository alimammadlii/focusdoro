const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { startSession, getSessions } = require('../controllers/sessionController');

// @route   POST /api/sessions
// @desc    Start a new pomodoro session
// @access  Private
router.post('/', protect, startSession);

// @route   GET /api/sessions
// @desc    Get all sessions for logged in user
// @access  Private
router.get('/', protect, getSessions);

module.exports = router;