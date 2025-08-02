const mongoose = require('mongoose');
const validator = require('validator');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    validate: {
      validator: function(url) {
        console.log('Model validation - URL being tested:', url);
        // Use built-in URL constructor which is more lenient with localhost
        try {
          const parsedUrl = new URL(url);
          const isValid = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
          console.log('Model validation - Is valid:', isValid);
          return isValid;
        } catch (error) {
          console.log('Model validation - URL parsing failed:', error.message);
          return false;
        }
      },
      message: 'Please provide a valid HTTP or HTTPS URL'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published'],
      message: 'Status must be either draft or published'
    },
    default: 'draft'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for optimized queries
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ status: 1, created_at: -1 }); // For public sessions

// Update the updated_at field before saving
sessionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Update the updated_at field before updating
sessionSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
