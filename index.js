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

// Mount auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Focusdoro API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
