const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET must be configured');
  }
  
  return jwt.sign(
    { id: userId },
    secret,
    { 
      expiresIn: process.env.JWT_EXPIRE || '24h',
      issuer: 'wellness-session-platform'
    }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET must be configured');
    }
    
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
