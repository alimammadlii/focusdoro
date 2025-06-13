const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    workDuration: {
      type: Number,
      default: 25,
      min: 1,
      max: 60
    },
    shortBreakDuration: {
      type: Number,
      default: 5,
      min: 1,
      max: 30
    },
    longBreakDuration: {
      type: Number,
      default: 15,
      min: 1,
      max: 60
    },
    longBreakInterval: {
      type: Number,
      default: 4,
      min: 1,
      max: 10
    },
    autoStartBreaks: {
      type: Boolean,
      default: false
    },
    autoStartPomodoros: {
      type: Boolean,
      default: false
    }
  },
  sessions: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    duration: Number,
    type: {
      type: String,
      enum: ['work', 'shortBreak', 'longBreak'],
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  statistics: {
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
    lastActiveDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timer', timerSchema); 