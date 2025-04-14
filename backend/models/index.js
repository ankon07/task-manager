const mongoose = require('mongoose');

const db = {
  mongoose: mongoose,
  user: require('./user.model'),
  role: require('./role.model'),
  task: require('./task.model'),
  category: require('./category.model'),
  ROLES: ["user", "admin"]
};

module.exports = db;
