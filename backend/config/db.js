const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development, use a simple local connection or skip if not available
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/wellness-session-platform';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('⚠️  Running without database connection - some features may not work');
    // Don't exit in development, just warn
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
