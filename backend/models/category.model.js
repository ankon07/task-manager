const mongoose = require('mongoose');

const Category = mongoose.model(
  'Category',
  new mongoose.Schema({
    name: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  })
);

module.exports = Category;