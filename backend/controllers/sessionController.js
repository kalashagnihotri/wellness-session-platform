const Session = require('../models/Session');
const validator = require('validator');

// @desc    Get all published sessions (public)
// @route   GET /api/sessions
// @access  Public
const getPublicSessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sessions = await Session.find({ status: 'published' })
      .select('title tags json_file_url created_at updated_at')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'email');

    const total = await Session.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      message: 'Published sessions retrieved successfully',
      data: {
        sessions,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_sessions: total,
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's sessions
// @route   GET /api/my-sessions
// @access  Private
const getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id })
      .sort({ updated_at: -1 });

    const drafts = sessions.filter(session => session.status === 'draft');
    const published = sessions.filter(session => session.status === 'published');

    res.status(200).json({
      success: true,
      message: 'User sessions retrieved successfully',
      data: {
        drafts,
        published,
        total: sessions.length
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get session by ID
// @route   GET /api/my-sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check ownership
    if (session.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own sessions.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session retrieved successfully',
      data: { session }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Save draft session
// @route   POST /api/my-sessions/save-draft
// @access  Private
const saveDraftSession = async (req, res, next) => {
  try {
    const { id, title, tags, json_file_url } = req.body;
    
    console.log('Save draft request received:', { id, title, tags, json_file_url });

    // Validation
    if (!title || !json_file_url) {
      console.log('Validation failed: missing title or json_file_url');
      return res.status(400).json({
        success: false,
        message: 'Title and JSON file URL are required'
      });
    }

    // Validate URL format - allow localhost for development
    const isValidUrl = (url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (!isValidUrl(json_file_url)) {
      console.log('URL validation failed for:', json_file_url);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid HTTP or HTTPS URL for the JSON configuration file'
      });
    }

    // Process tags (handle both string and array formats)
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        // Tags already in array format from frontend
        processedTags = tags.filter(tag => tag && tag.trim().length > 0);
      } else if (typeof tags === 'string') {
        // Tags in comma-separated string format
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    let session;

    if (id) {
      // Update existing session
      session = await Session.findById(id);
      
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Check ownership
      if (session.user_id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only edit your own sessions.'
        });
      }

      session.title = title;
      session.tags = processedTags;
      session.json_file_url = json_file_url;
      session.updated_at = Date.now();

      await session.save();
    } else {
      // Create new session
      session = await Session.create({
        user_id: req.user.id,
        title,
        tags: processedTags,
        json_file_url,
        status: 'draft'
      });
    }

    res.status(200).json({
      success: true,
      message: id ? 'Draft updated successfully' : 'Draft saved successfully',
      data: { session }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Publish session
// @route   POST /api/my-sessions/publish
// @access  Private
const publishSession = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check ownership
    if (session.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only publish your own sessions.'
      });
    }

    session.status = 'published';
    session.updated_at = Date.now();
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session published successfully',
      data: { session }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/my-sessions/:id
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check ownership
    if (session.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own sessions.'
      });
    }

    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSessions,
  getMySessions,
  getSessionById,
  saveDraftSession,
  publishSession,
  deleteSession
};
