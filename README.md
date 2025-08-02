# Wellness Session Platform

A production-ready full-stack wellness technology platform for creating, managing, and sharing wellness session configurations with JWT authentication, auto-save functionality, and MongoDB Atlas cloud database integration.

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB Atlas, JWT Authentication  
**Frontend:** React 19, TypeScript, Vite, TailwindCSS, Framer Motion  

## Production Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your MongoDB Atlas connection and JWT secret in .env
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL to point to your backend
npm run build
```

## Environment Configuration

### Backend (.env)
```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness-session-platform?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_key
JWT_EXPIRE=24h
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Core Features

- **User Authentication** - Secure JWT-based registration and login
- **Session Management** - Create, edit, publish, and delete wellness sessions
- **Auto-Save** - Automatic draft saving with 5-second debounce
- **Cloud Database** - MongoDB Atlas integration for scalable data storage
- **Responsive UI** - Mobile-first wellness-themed interface
- **Real-time Validation** - Form validation with immediate feedback
- **Session Discovery** - Public browsing with search and pagination

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sessions (Public)
- `GET /api/sessions` - Get published sessions (paginated)

### Sessions (Protected)
- `GET /api/sessions/my-sessions` - Get user's sessions
- `GET /api/sessions/my-sessions/:id` - Get specific session
- `POST /api/sessions/my-sessions/save-draft` - Save/update draft
- `POST /api/sessions/my-sessions/publish` - Publish session
- `DELETE /api/sessions/my-sessions/:id` - Delete session

## JSON Configuration Schema

Sessions reference external JSON configurations with structured wellness data:

```json
{
  "sessionInfo": {
    "title": "Morning Meditation",
    "duration": 900,
    "difficulty": "beginner",
    "category": "meditation",
    "instructor": "Dr. Sarah Chen"
  },
  "sessionStructure": {
    "phases": [
      {
        "name": "Preparation",
        "duration": 120,
        "type": "setup",
        "instructions": ["Find comfortable position", "..."]
      }
    ]
  },
  "personalizations": {
    "adaptable": true,
    "customizations": [...]
  },
  "progressTracking": {
    "enabled": true,
    "metrics": ["completion_rate", "mood_before", "mood_after"]
  }
}
```

**Example files:**
- `example-wellness-session.json` - Complete meditation session with phases, audio, tracking
- `simple-session.json` - Basic breathing exercise configuration

## Production Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables for production
2. Configure MongoDB Atlas with proper IP whitelisting
3. Deploy with `npm start` command
4. Ensure CORS is configured for your frontend domain

### Frontend (Vercel/Netlify)
1. Run `npm run build` to generate production build
2. Deploy `dist` folder to hosting platform
3. Configure environment variables for production API URL
4. Set up custom domain and SSL

## Health Check

- **Backend Health:** `GET /health`
- **Database Status:** Automatic connection monitoring
- **Authentication:** JWT token validation on protected routes

## Architecture

- **MVC Pattern** - Proper separation of routes, controllers, and models
- **JWT Security** - Stateless authentication with bcrypt password hashing
- **Data Validation** - Input validation and sanitization
- **Error Handling** - Comprehensive error middleware
- **Auto-Save** - Debounced draft saving with conflict resolution


