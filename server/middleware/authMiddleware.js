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
      let user = await userService.getById(decodedToken.uid);

      if (!user) {
        // If the user exists in Firebase Auth but has no Firestore profile, create one automatically.
        const authUser = await firebaseAuth.getUser(decodedToken.uid);
        const email = authUser.email ? authUser.email.toLowerCase() : null;
        const name = authUser.displayName || decodedToken.name || (email ? email.split('@')[0] : 'Anonymous');
        const role = 'Candidate';

        user = await userService.create({
          id: decodedToken.uid,
          uid: decodedToken.uid,
          name,
          email,
          role,
          createdAt: new Date(),
          updatedAt: new Date()
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
