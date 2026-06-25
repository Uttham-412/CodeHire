const { auth: firebaseAuth, isInitialized, initError } = require('../config/firebase');
const { userService } = require('../services/firestore');

/**
 * Register a new user in Firebase Auth and Firestore.
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, password, role.'
      });
    }

    if (role !== 'interviewer' && role !== 'candidate' && role !== 'Interviewer' && role !== 'Candidate') {
      return res.status(400).json({
        success: false,
        error: 'Role must be either interviewer or candidate.'
      });
    }

    // Check Firebase configuration
    if (!isInitialized || !firebaseAuth) {
      return res.status(503).json({
        success: false,
        error: `Authentication service is currently unavailable. ${initError || ''}`
      });
    }

    // Create Firebase Authentication user (Credentials managed purely by Firebase Auth)
    let firebaseUser;
    try {
      firebaseUser = await firebaseAuth.createUser({
        email: email.toLowerCase(),
        password: password,
        displayName: name
      });
    } catch (fbError) {
      return res.status(400).json({
        success: false,
        error: fbError.message
      });
    }

    // Normalize role to match frontend expectation ('Interviewer' or 'Candidate')
    const normalizedRole = role.toLowerCase() === 'interviewer' ? 'Interviewer' : 'Candidate';

    // Store user profile in Firestore (No passwords or hashes are stored here)
    const userProfile = {
      uid: firebaseUser.uid,
      name,
      email: email.toLowerCase(),
      role: normalizedRole,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const storedUser = await userService.create({
      id: firebaseUser.uid, // Set Firestore document ID to match the Firebase Auth UID
      ...userProfile
    });

    res.status(201).json({
      success: true,
      user: {
        uid: storedUser.uid,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
        createdAt: storedUser.createdAt,
        updatedAt: storedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during registration.'
    });
  }
};

/**
 * Verify a Firebase ID Token and return user profile.
 */
const verify = async (req, res) => {
  try {
    // User profile was already attached to req.user by protect middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Verification endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during verification.'
    });
  }
};

/**
 * Retrieve active user profile.
 */
const getMe = async (req, res) => {
  try {
    // User profile was already attached to req.user by protect middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('GetMe endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error retrieving profile.'
    });
  }
};

module.exports = {
  register,
  verify,
  getMe
};
