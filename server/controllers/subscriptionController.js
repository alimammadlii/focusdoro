const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Get user's subscription
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};

// Create or update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { plan, paymentId } = req.body;
    
    // Calculate end date based on plan
    const endDate = new Date();
    switch (plan) {
      case 'premium':
        endDate.setMonth(endDate.getMonth() + 1); // 1 month
        break;
      case 'enterprise':
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 year
        break;
      default:
        endDate.setDate(endDate.getDate() + 30); // 30 days for free trial
    }

    // Update features based on plan
    const features = {
      adFree: plan !== 'free',
      unlimitedTasks: plan !== 'free',
      advancedStats: plan !== 'free',
      customThemes: plan === 'enterprise'
    };

    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      {
        plan,
        status: 'active',
        endDate,
        paymentId,
        features
      },
      { new: true, upsert: true }
    );

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};

// Check subscription status
exports.checkSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.json({ 
        hasSubscription: false,
        plan: 'free',
        features: {
          adFree: false,
          unlimitedTasks: false,
          advancedStats: false,
          customThemes: false
        }
      });
    }

    const isActive = subscription.isActive();
    const remainingDays = subscription.getRemainingDays();

    res.json({
      hasSubscription: isActive,
      plan: subscription.plan,
      status: subscription.status,
      remainingDays,
      features: subscription.features
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking subscription status', error: error.message });
  }
}; 