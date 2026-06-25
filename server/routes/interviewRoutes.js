const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// Create a new interview
router.post('/', interviewController.createInterview);
// Get all interviews
router.get('/', interviewController.getInterviews);

module.exports = router;
