const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the project root
app.use('/json', express.static(path.join(__dirname)));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'JSON file server running' });
});

// List available JSON files
app.get('/', (req, res) => {
  res.json({
    message: 'Wellness Session JSON Server',
    availableFiles: [
      'http://localhost:3000/json/example-wellness-session.json',
      'http://localhost:3000/json/simple-breathing-session.json'
    ]
  });
});

app.listen(port, () => {
  console.log(`🗂️  JSON file server running on http://localhost:${port}`);
  console.log(`📄 Example files available at:`);
  console.log(`   http://localhost:${port}/json/example-wellness-session.json`);
  console.log(`   http://localhost:${port}/json/simple-breathing-session.json`);
});

module.exports = app;
