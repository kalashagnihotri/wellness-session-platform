# Wellness Session Platform

A production-ready full-stack wellness technology platform for creating, managing, and sharing wellness session configurations with JWT authentication, auto-save functionality, and MongoDB Atlas cloud database integration.

## 🌐 Live Production Deployment

**🚀 Application is now live and deployed:**

- **Frontend**: https://wellness-session-platform-roan.vercel.app
- **Backend API**: https://wellness-session-platform-f0wd.onrender.com
- **Health Check**: https://wellness-session-platform-f0wd.onrender.com/health

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB Atlas, JWT Authentication (deployed on Render)  
**Frontend:** React 19, TypeScript, Vite, TailwindCSS, Framer Motion (deployed on Vercel)  

## 🎯 Quick Test

1. **Visit**: https://wellness-session-platform-roan.vercel.app
2. **Register** a new account or **Login** 
3. **Create Session** using these JSON Configuration URLs:
   - `https://jsonplaceholder.typicode.com/posts/1`
   - `https://httpbin.org/json`
   - `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json`

## Local Development Setup

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

## Production Deployment Status

### ✅ Current Live Deployment
- **Frontend**: Deployed on Vercel at https://wellness-session-platform-roan.vercel.app
- **Backend**: Deployed on Render at https://wellness-session-platform-f0wd.onrender.com  
- **Database**: MongoDB Atlas cloud cluster
- **Status**: Fully operational with all features working

### Backend (Render)
1. ✅ Environment variables configured for production
2. ✅ MongoDB Atlas connected with proper IP whitelisting
3. ✅ Deployed with `npm start` command
4. ✅ CORS configured for Vercel frontend domain

### Frontend (Vercel)
1. ✅ Production build generated with `npm run build`
2. ✅ Deployed `dist` folder to Vercel
3. ✅ Environment variables configured for production API URL
4. ✅ Custom domain and SSL configured

## Health Check

- **Production Backend Health:** https://wellness-session-platform-f0wd.onrender.com/health
- **Database Status:** Automatic connection monitoring with MongoDB Atlas
- **Authentication:** JWT token validation on protected routes

## Architecture

- **MVC Pattern** - Proper separation of routes, controllers, and models
- **JWT Security** - Stateless authentication with bcrypt password hashing
- **Data Validation** - Input validation and sanitization
- **Error Handling** - Comprehensive error middleware
- **Auto-Save** - Debounced draft saving with conflict resolution


