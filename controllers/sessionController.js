const Session = require('../models/Session');

// @desc    Start a new pomodoro session
// @access  Private
const startSession = async (req, res) => {
    try {
        const { duration, sessionType } = req.body;

        const session = await Session.create({
            user: req.user._id,
            duration: duration || 25,
            sessionType: sessionType || 'work'
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error creating session'
        });
    }
};

// @desc    Get all sessions for logged in user
// @access  Private
const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({
            count: sessions.length,
            sessions
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching sessions'
        });
    }
};

module.exports = {
    startSession,
    getSessions
};