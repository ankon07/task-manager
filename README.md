# Task Manager Application

A full-stack task management application with a modern React frontend and Node.js backend.

## Project Structure

This project is organized into two main directories:

- `frontend/`: Contains the React frontend application
- `backend/`: Contains the Node.js/Express backend API

## Features

### Frontend
- Modern UI/UX with a purple/lavender color scheme
- Responsive design for desktop, tablet, and mobile
- Authentication (login, register, password reset)
- Task management (create, view, edit, delete)
- Task filtering and organization
- Calendar view for tasks
- User profile management
- Application settings

### Backend
- RESTful API built with Express.js
- JWT authentication
- MongoDB database with Mongoose ODM
- Role-based access control
- Task and category management
- User management

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation and Setup

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   npm install
   cp .env.example .env  # Create .env file from example
   # Edit .env file with your MongoDB connection string and JWT secret
   npm run init-db  # Initialize the database with sample data
   npm start
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Documentation

The backend API provides the following endpoints:

- **Authentication**
  - POST /api/auth/signup
  - POST /api/auth/signin
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password

- **Tasks**
  - GET /api/tasks
  - POST /api/tasks
  - GET /api/tasks/:id
  - PUT /api/tasks/:id
  - DELETE /api/tasks/:id
  - GET /api/tasks/today
  - GET /api/tasks/week
  - GET /api/tasks/month
  - GET /api/tasks/completed

- **Categories**
  - GET /api/categories
  - POST /api/categories
  - GET /api/categories/:id
  - PUT /api/categories/:id
  - DELETE /api/categories/:id

- **Users**
  - GET /api/users/:id
  - PUT /api/users/:id
  - POST /api/users/:id/change-password

## Technologies Used

### Frontend
- React
- React Router
- Tailwind CSS
- Axios
- Chart.js
- React Icons
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js for password hashing

## License

This project is licensed under the MIT License.
