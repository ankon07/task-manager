require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database Connection
const dbConfig = require('./config/db.config');
const db = require('./models');
const Role = db.role;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Successfully connected to the database');
    initial();
  })
  .catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

// Initialize Roles
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({ name: 'user' }).save((err) => {
        if (err) console.log('error', err);
        console.log("added 'user' to roles collection");
      });
      new Role({ name: 'admin' }).save((err) => {
        if (err) console.log('error', err);
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Secure Task Management System.' });
});

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');

// Initialize routes
authRoutes(app);
taskRoutes(app);
categoryRoutes(app);
userRoutes(app);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
