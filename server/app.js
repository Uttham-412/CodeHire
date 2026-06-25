const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { isInitialized, initError } = require('./config/firebase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "InterviewOS API Running"
  });
});

// Firebase status check route
app.get('/api/firebase/status', (req, res) => {
  if (!isInitialized) {
    return res.status(500).json({
      success: false,
      error: initError || "Firebase configuration credentials are missing or invalid."
    });
  }
  res.json({
    success: true,
    firebase: "connected"
  });
});

// Routes (to be added later)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/candidates', require('./routes/candidateRoutes'));
// app.use('/api/interviews', require('./routes/interviewRoutes'));
// app.use('/api/questions', require('./routes/questionRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));

module.exports = app;
