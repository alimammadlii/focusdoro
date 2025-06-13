const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const auth = require('../middleware/auth');

// All routes are protected and require authentication
router.use(auth);

// Get user's statistics
router.get('/', statisticsController.getStatistics);

// Record a new pomodoro session
router.post('/record', statisticsController.recordPomodoro);

module.exports = router; 