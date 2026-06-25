const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// Create a new interview
router.post('/', interviewController.createInterview);

module.exports = router;
