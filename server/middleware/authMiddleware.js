const { auth: firebaseAuth, isInitialized, initError } = require('../config/firebase');
const { userService } = require('../services/firestore');

/**
 * Middleware to protect routes by validating Firebase ID Token.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      if (!isInitialized || !firebaseAuth) {
        return res.status(503).json({
          success: false,
          error: `Authentication service is not initialized. ${initError || ''}`
        });
      }

      // Verify the Firebase ID Token using Firebase Admin SDK
      const decodedToken = await firebaseAuth.verifyIdToken(token);

      // Load user profile from Firestore using decoded uid
      const user = await userService.getById(decodedToken.uid);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User profile not found in Firestore.'
        });
      }

      // Attach verified user and token info to request object
      req.user = user;
      req.decodedToken = decodedToken;

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, invalid token: ' + error.message
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided.'
    });
  }
};

/**
 * Middleware to restrict route access to specific roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized.'
      });
    }
    const userRole = req.user.role.toLowerCase();
    const authorized = roles.some(r => r.toLowerCase() === userRole);
    if (!authorized) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
