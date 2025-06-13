const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentId: {
    type: String
  },
  features: {
    adFree: {
      type: Boolean,
      default: false
    },
    unlimitedTasks: {
      type: Boolean,
      default: false
    },
    advancedStats: {
      type: Boolean,
      default: false
    },
    customThemes: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Add method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Add method to get remaining days
subscriptionSchema.methods.getRemainingDays = function() {
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription; 