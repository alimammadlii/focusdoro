const Statistics = require('../models/Statistics');

// Get user's statistics
exports.getStatistics = async (req, res) => {
  try {
    let statistics = await Statistics.findOne({ user: req.user.id });

    if (!statistics) {
      // Create new statistics for the user if none exists
      statistics = new Statistics({
        user: req.user.id,
        daily: [],
        weekly: [],
        totalPomodoros: 0,
        totalFocusTime: 0,
        dailyStreak: 0,
        averagePomodoros: 0
      });
      await statistics.save();
    }

    // Calculate daily streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastRecord = statistics.daily[statistics.daily.length - 1];
    if (lastRecord) {
      const lastDate = new Date(lastRecord.date);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        statistics.dailyStreak += 1;
      } else if (diffDays > 1) {
        statistics.dailyStreak = 0;
      }
    }

    // Calculate average pomodoros per day
    if (statistics.daily.length > 0) {
      const totalPomodoros = statistics.daily.reduce((sum, day) => sum + day.pomodoros, 0);
      statistics.averagePomodoros = totalPomodoros / statistics.daily.length;
    }

    await statistics.save();
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// Record a new pomodoro session
exports.recordPomodoro = async (req, res) => {
  try {
    const { type, duration } = req.body;
    let statistics = await Statistics.findOne({ user: req.user.id });

    if (!statistics) {
      statistics = new Statistics({
        user: req.user.id,
        daily: [],
        weekly: [],
        totalPomodoros: 0,
        totalFocusTime: 0,
        dailyStreak: 0,
        averagePomodoros: 0
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update daily statistics
    const dailyIndex = statistics.daily.findIndex(
      day => new Date(day.date).getTime() === today.getTime()
    );

    if (dailyIndex === -1) {
      statistics.daily.push({
        date: today,
        pomodoros: 1,
        focusTime: duration
      });
    } else {
      statistics.daily[dailyIndex].pomodoros += 1;
      statistics.daily[dailyIndex].focusTime += duration;
    }

    // Update weekly statistics
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekIndex = statistics.weekly.findIndex(
      week => new Date(week.week).getTime() === weekStart.getTime()
    );

    if (weekIndex === -1) {
      statistics.weekly.push({
        week: weekStart,
        focusTime: duration
      });
    } else {
      statistics.weekly[weekIndex].focusTime += duration;
    }

    // Update total statistics
    statistics.totalPomodoros += 1;
    statistics.totalFocusTime += duration;

    // Keep only last 30 days of daily data and 12 weeks of weekly data
    statistics.daily = statistics.daily.slice(-30);
    statistics.weekly = statistics.weekly.slice(-12);

    await statistics.save();
    res.json(statistics);
  } catch (error) {
    console.error('Error recording pomodoro:', error);
    res.status(500).json({ message: 'Error recording pomodoro', error: error.message });
  }
}; 