const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  daily: [{
    date: {
      type: Date,
      required: true
    },
    pomodoros: {
      type: Number,
      default: 0
    },
    focusTime: {
      type: Number,
      default: 0
    }
  }],
  weekly: [{
    week: {
      type: Date,
      required: true
    },
    focusTime: {
      type: Number,
      default: 0
    }
  }],
  totalPomodoros: {
    type: Number,
    default: 0
  },
  totalFocusTime: {
    type: Number,
    default: 0
  },
  dailyStreak: {
    type: Number,
    default: 0
  },
  averagePomodoros: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Statistics', statisticsSchema); 