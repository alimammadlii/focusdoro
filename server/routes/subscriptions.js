const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// All routes are protected and require authentication
router.use(auth);

// Get user's subscription
router.get('/', subscriptionController.getSubscription);

// Create or update subscription
router.post('/', subscriptionController.updateSubscription);

// Cancel subscription
router.post('/cancel', subscriptionController.cancelSubscription);

// Check subscription status
router.get('/status', subscriptionController.checkSubscriptionStatus);

module.exports = router; 