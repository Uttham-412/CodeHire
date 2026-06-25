<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# InterviewOS - Full-Stack Technical Interview Platform

A scalable full-stack application for conducting technical interviews with real-time code evaluation, video conferencing, and candidate management.

## Architecture Overview

InterviewOS follows a monorepo structure with separate client and server applications:

```
InterviewOS
│
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Sidebar)
│   │   ├── pages/         # Page components (Dashboard, Candidates, Interviews, etc.)
│   │   ├── App.tsx        # Main routing and state management
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── data.ts        # Data management utilities
│   ├── package.json
│   └── vite.config.ts
│
└── server/          # Express.js backend application
    ├── config/          # Database and application configuration
    ├── controllers/     # Request handlers (auth, candidates, interviews, questions, reports)
    ├── middleware/      # Custom middleware (auth, error handling, validation)
    ├── models/          # Database models (User, Candidate, Interview, Question)
    ├── routes/          # API route definitions
    ├── sockets/         # Socket.io handlers for real-time features
    ├── services/        # External service integrations (code execution, email, WebRTC)
    ├── utils/           # Utility functions (helpers, logger)
    ├── uploads/         # File upload directory
    └── server.js        # Server entry point
```

## Tech Stack

### Client (Frontend)
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6.2.3
- **Routing:** React Router v7 (HashRouter)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Motion
- **State Management:** React Hooks (useState, useEffect)

### Server (Backend)
- **Runtime:** Node.js with Express.js
- **Database:** (To be implemented - PostgreSQL/MongoDB)
- **Authentication:** JWT (To be implemented)
- **Real-time:** Socket.io (To be implemented)
- **Code Execution:** Judge0 API (To be implemented)
- **Video/Audio:** WebRTC (To be implemented)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   Create a `.env.local` file in the client directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The client will run on `http://localhost:3000`

### Server Setup (Coming Soon)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   Create a `.env` file in the server directory with:
   ```
   PORT=5000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   JUDGE0_API_KEY=your_judge0_api_key
   ```

4. Run the server:
   ```bash
   node server.js
   ```

   The server will run on `http://localhost:5000`

## Current Status

### ✅ Completed
- Full React frontend with 9 pages
- Candidate management system
- Interview scheduling interface
- Question bank management
- Aptitude test templates
- Reports and analytics dashboard
- Settings and configuration
- Coding sandbox with simulation
- Role-based authentication UI
- Folder structure reorganization

### 🚧 To Be Implemented
- Backend API with Express.js
- Database integration (PostgreSQL/MongoDB)
- JWT authentication system
- Real code execution (Judge0 integration)
- WebRTC video/audio streaming
- Socket.io for real-time features
- Email notification service
- File upload handling
- API documentation

## Features

### For Interviewers
- Dashboard with metrics and analytics
- Candidate management and tracking
- Interview scheduling with calendar integration
- Question bank management
- Live coding evaluation
- HR evaluation and scoring
- Reports and export functionality

### For Candidates
- Secure interview room access via joining ID
- Pre-flight hardware checks
- Real-time coding environment
- Multi-language support (JavaScript, Python, Go, Java)
- Live chat with interviewers
- Timer and progress tracking

## Development Roadmap

1. **Phase 1:** Backend API setup with Express.js
2. **Phase 2:** Database integration and models
3. **Phase 3:** JWT authentication system
4. **Phase 4:** Real-time features with Socket.io
5. **Phase 5:** Code execution integration
6. **Phase 6:** WebRTC video/audio implementation
7. **Phase 7:** Email and notification services
8. **Phase 8:** Testing and deployment

## License

MIT
