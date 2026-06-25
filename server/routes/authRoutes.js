const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public route to register a new user (which creates user in Firebase Auth and profile in Firestore)
router.post('/register', authController.register);

// Protected route to verify the Firebase ID Token
router.post('/verify', protect, authController.verify);

// Protected route to retrieve logged-in user profile
router.get('/me', protect, authController.getMe);

module.exports = router;
