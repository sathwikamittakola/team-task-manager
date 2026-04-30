# Team Task Manager (Full-Stack MERN)

A robust, production-ready task management platform built with React, Node.js, Express, and MongoDB.

## 🚀 Features
- **Authentication**: Secure JWT-based login and signup with password hashing.
- **Role-Based Access Control (RBAC)**: Admin and Member roles with specific permissions.
- **Project Management**: Create and track projects (Admin only).
- **Task Management**: Create, assign, and update tasks with real-time status tracking.
- **Dynamic Dashboard**: Summary of total, completed, pending, and overdue tasks.
- **User Management**: Administrative interface to manage users and promote/demote roles.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Joi Validation, JWT.
- **Security**: Bcrypt password hashing, CORS protection, JWT Authentication.

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 2. Backend Setup (`ethara2`)
```bash
cd ethara2
npm install
```
Create a `.env` file in `ethara2/`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```
Run development server:
```bash
npm run dev
```

### 3. Frontend Setup (`ethara`)
```bash
cd ethara
npm install
```
Create a `.env` file in `ethara/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Run development server:
```bash
npm run dev
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup`: Register new user
- `POST /api/auth/login`: Authenticate user

### Projects (Admin only for POST)
- `GET /api/projects`: Get all accessible projects
- `POST /api/projects`: Create a new project

### Tasks
- `GET /api/tasks`: Get tasks (optionally filter by `projectId`)
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update task status

### Users (Admin only)
- `GET /api/users`: List all users
- `PUT /api/users/:id/role`: Update user role

## 🚢 Deployment
1. Set `NODE_ENV=production` in environment variables.
2. Ensure `ALLOWED_ORIGINS` includes your production frontend URL.
3. Use a platform like Railway, Heroku, or Vercel.

## 📝 License
MIT
