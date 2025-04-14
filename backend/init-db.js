// backend/init-db.js
const mongoose = require('mongoose');
require('dotenv').config();
const db = require('./models');
const Role = db.role;

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
  initializeRoles();
})
.catch(err => {
  console.error('Connection error', err);
  process.exit(1);
});

// Initialize roles in the database
const initializeRoles = async () => {
  try {
    // Check if roles collection is empty
    const count = await Role.estimatedDocumentCount();
    
    if (count === 0) {
      // Create default roles
      await Promise.all([
        new Role({ name: 'user' }).save(),
        new Role({ name: 'admin' }).save()
      ]);
      
      console.log('Added default roles to the database.');
    } else {
      console.log('Roles are already initialized.');
    }
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing roles:', err);
    process.exit(1);
  }
};
