# Task Manager API

A secure and feature-rich task management system API built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control
- Task management (CRUD operations)
- Category management
- Task filtering, sorting, and searching
- Automatic category creation
- Secure password handling with bcrypt

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, helmet for HTTP headers
- **Other**: dotenv for environment variables, cors for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=86400
   ```

4. Initialize the database (if needed):
   ```bash
   node backend/init-db.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port on which the server will run | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/task-manager |
| JWT_SECRET | Secret key for JWT token generation | - |
| JWT_EXPIRATION | JWT token expiration time in seconds | 86400 (24 hours) |

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get access token

### Tasks

- `GET /api/tasks` - Get all tasks (with filtering options)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Dependencies

### Production Dependencies

- **express**: ^4.17.1 - Web framework for Node.js
- **mongoose**: ^6.0.0 - MongoDB object modeling
- **jsonwebtoken**: ^8.5.1 - JWT implementation
- **bcryptjs**: ^2.4.3 - Password hashing
- **nodemailer**: ^6.6.1 - Email sending (for password reset, etc.)
- **dotenv**: ^10.0.0 - Environment variable management
- **cors**: ^2.8.5 - Cross-Origin Resource Sharing
- **helmet**: ^4.6.0 - Security headers
- **morgan**: ^1.10.0 - HTTP request logger

### Development Dependencies

- **nodemon**: ^2.0.12 - Auto-restart server on file changes

## Setting Up GitHub Repository

### Option 1: Using the Setup Script (Recommended)

We've included a setup script to make it easy to initialize Git and push to GitHub:

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com)
   - Click on "New repository"
   - Name your repository (e.g., "task-manager")
   - Choose visibility (public or private)
   - Click "Create repository" (do not initialize with README, .gitignore, or license)

2. Run the setup script:
   ```bash
   ./setup-git.sh
   ```

3. Follow the prompts to enter your GitHub username and repository name.

4. The script will:
   - Initialize Git (if not already done)
   - Update package.json and README.md with your repository URL
   - Add and commit all files
   - Add the remote repository
   - Optionally push to GitHub

### Option 2: Manual Setup

If you prefer to set up Git manually:

1. Create a new repository on GitHub as described above.

2. Initialize Git in your local project:
   ```bash
   git init
   ```

3. Add your files to Git:
   ```bash
   git add .
   ```

4. Commit your changes:
   ```bash
   git commit -m "Initial commit"
   ```

5. Add the remote repository:
   ```bash
   git remote add origin https://github.com/your-username/task-manager.git
   ```

6. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
   (Use `master` instead of `main` if your default branch is named `master`)

## Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   ├── auth.config.js
│   │   └── db.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.jwt.js
│   │   ├── index.js
│   │   └── verifySignUp.js
│   ├── models/
│   │   ├── category.model.js
│   │   ├── index.js
│   │   ├── role.model.js
│   │   ├── task.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── task.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── email.util.js
│   │   └── validation.util.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
