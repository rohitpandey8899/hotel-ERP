# Hotel Management System

A modern hotel management system built with React, Node.js, and MongoDB.

## Features

- Room management
- Booking system
- Guest check-in/check-out
- Dashboard with analytics
- Responsive design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start frontend
   npm run dev

   # Start backend (in a separate terminal)
   cd backend
   npm run dev
   ```

## Deployment

The application is deployed on Vercel:
- Frontend: [Your Vercel Frontend URL]
- Backend: [Your Vercel Backend URL] 