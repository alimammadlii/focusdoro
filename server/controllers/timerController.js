const Timer = require('../models/Timer');
const User = require('../models/User');

// @desc    Get user's timer settings and statistics
// @route   GET /api/timer
// @access  Private
exports.getTimer = async (req, res) => {
  try {
    let timer = await Timer.findOne({ user: req.user.id });
    
    if (!timer) {
      // Create default timer settings for new users
      timer = await Timer.create({
        user: req.user.id,
        settings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4
        }
      });
    }
    
    res.json(timer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update timer settings
// @route   PUT /api/timer/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const timer = await Timer.findOne({ user: req.user.id });
    
    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    const { workDuration, shortBreakDuration, longBreakDuration, longBreakInterval, autoStartBreaks, autoStartPomodoros } = req.body;

    timer.settings = {
      workDuration: workDuration || timer.settings.workDuration,
      shortBreakDuration: shortBreakDuration || timer.settings.shortBreakDuration,
      longBreakDuration: longBreakDuration || timer.settings.longBreakDuration,
      longBreakInterval: longBreakInterval || timer.settings.longBreakInterval,
      autoStartBreaks: autoStartBreaks !== undefined ? autoStartBreaks : timer.settings.autoStartBreaks,
      autoStartPomodoros: autoStartPomodoros !== undefined ? autoStartPomodoros : timer.settings.autoStartPomodoros
    };

    await timer.save();
    res.json(timer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Start a new timer session
// @route   POST /api/timer/session
// @access  Private
exports.startSession = async (req, res) => {
  try {
    const { type } = req.body;
    const timer = await Timer.findOne({ user: req.user.id });
    
    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    const session = {
      startTime: new Date(),
      type,
      completed: false
    };

    timer.sessions.push(session);
    await timer.save();

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Complete a timer session
// @route   PUT /api/timer/session/:sessionId
// @access  Private
exports.completeSession = async (req, res) => {
  try {
    const timer = await Timer.findOne({ user: req.user.id });
    
    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    const session = timer.sessions.id(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.endTime = new Date();
    session.completed = true;
    session.duration = (session.endTime - session.startTime) / 1000 / 60; // Duration in minutes

    // Update statistics
    if (session.type === 'work') {
      timer.statistics.totalPomodoros += 1;
      timer.statistics.totalFocusTime += session.duration;
    }

    // Update daily streak
    const today = new Date().toDateString();
    const lastActive = timer.statistics.lastActiveDate ? new Date(timer.statistics.lastActiveDate).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastActive === yesterdayString) {
        timer.statistics.dailyStreak += 1;
      } else {
        timer.statistics.dailyStreak = 1;
      }
      
      timer.statistics.lastActiveDate = new Date();
    }

    await timer.save();
    res.json(timer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 