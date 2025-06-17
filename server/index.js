const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/timer', require('./routes/timerRoutes'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/subscription', require('./routes/subscriptions'));
app.use('/api/statistics', require('./routes/statistics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Focusdoro API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
