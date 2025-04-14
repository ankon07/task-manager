// backend/controllers/category.controller.js
const db = require("../models");
const Category = db.category;
const Task = db.task;

// Create a new category [cite: 7]
exports.createCategory = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Category name cannot be empty!" }); // [cite: 17]
  }

  const category = new Category({
    name: name,
    // Decide if categories are global or user-specific.
    // If user-specific, uncomment the line below:
    // user: req.userId
  });

  category.save()
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      // Handle potential duplicate key error if name is unique
      if (err.code === 11000) {
           return res.status(400).send({ message: "Category name already exists." });
       }
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Category."
      });
    });
};

// Retrieve all categories (adjust based on global vs. user-specific)
exports.findAllCategories = (req, res) => {
   // If categories are user-specific:
   // const condition = { user: req.userId };
   // If categories are global:
   const condition = {};

  Category.find(condition)
    .sort({ name: 1 }) // Sort alphabetically
    .exec()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving categories."
      });
    });
};

// Find a single category by ID
exports.findOneCategory = (req, res) => {
  const id = req.params.id;
   // Add user check if categories are user-specific:
   // const userId = req.userId;
   // Category.findOne({ _id: id, user: userId })

  Category.findById(id)
    .exec()
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Category not found with id=${id}.` });
      }
      res.send(data);
    })
    .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({ message: `Category not found with id=${id}.` });
      }
      res.status(500).send({ message: `Error retrieving Category with id=${id}.` });
    });
};

// Update a category by ID
exports.updateCategory = (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).send({ message: "Category name cannot be empty!" }); // [cite: 17]
  }

  const id = req.params.id;
  const updateData = { name: req.body.name };
   // Add user check if categories are user-specific:
   // const userId = req.userId;
   // Category.findOneAndUpdate({ _id: id, user: userId }, updateData, { useFindAndModify: false, new: true })

  Category.findByIdAndUpdate(id, updateData, { useFindAndModify: false, new: true })
    .exec()
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found!` // Add permission check message if needed
        });
      } else {
        res.send({ message: "Category was updated successfully.", data: data });
      }
    })
    .catch(err => {
       if (err.kind === 'ObjectId') {
          return res.status(404).send({ message: `Category not found with id=${id}.` });
       }
        // Handle potential duplicate key error
       if (err.code === 11000) {
           return res.status(400).send({ message: "Category name already exists." });
       }
      res.status(500).send({ message: `Error updating Category with id=${id}.` });
    });
};

// Delete a category by ID
exports.deleteCategory = (req, res) => {
  const id = req.params.id;
  // Add user check if categories are user-specific:
   // const userId = req.userId;

  // Optional: Check if any tasks are using this category before deleting
  Task.countDocuments({ category: id })
    .then(count => {
        if (count > 0) {
            return res.status(400).send({ message: `Cannot delete Category with id=${id}. It is currently assigned to ${count} task(s). Reassign tasks first.` });
        }

        // Proceed with deletion if no tasks are assigned
        // Category.findOneAndDelete({ _id: id, user: userId }) // If user-specific
        Category.findByIdAndDelete(id) // If global
          .exec()
          .then(data => {
            if (!data) {
              res.status(404).send({
                message: `Cannot delete Category with id=${id}. Maybe Category was not found!` // Add permission check message if needed
              });
            } else {
              res.send({ message: "Category was deleted successfully!" });
            }
          })
          .catch(err => {
             if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Category not found with id=${id}.` });
            }
            res.status(500).send({ message: `Could not delete Category with id=${id}.` });
          });
    })
    .catch(err => {
        res.status(500).send({ message: `Error checking tasks for category id=${id}.` });
    });
};