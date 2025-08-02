const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
