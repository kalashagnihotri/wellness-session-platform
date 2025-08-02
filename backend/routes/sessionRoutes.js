const express = require('express');
const {
  getPublicSessions,
  getMySessions,
  getSessionById,
  saveDraftSession,
  publishSession,
  deleteSession
} = require('../controllers/sessionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getPublicSessions); // GET /api/sessions

// Private routes - all require authentication
router.use(authMiddleware);

router.get('/my-sessions', getMySessions);
router.get('/my-sessions/:id', getSessionById);
router.post('/my-sessions/save-draft', saveDraftSession);
router.post('/my-sessions/publish', publishSession);
router.delete('/my-sessions/:id', deleteSession);

module.exports = router;
