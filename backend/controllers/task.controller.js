// backend/controllers/task.controller.js
const mongoose = require('mongoose');
const db = require("../models");
const Task = db.task;

// Create a new task [cite: 4]
exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  // Handle both categoryId and category_id to be flexible
  const categoryIdOrName = req.body.categoryId || req.body.category_id || req.body.category;

  // Basic validation [cite: 17]
  if (!title) {
    return res.status(400).send({ message: "Task title cannot be empty!" });
  }

  try {
    // Handle category assignment
    let categoryRef = null;
    if (categoryIdOrName) {
      const Category = db.category;
      
      let category = null;
      
      // Check if the value is a valid ObjectId before trying to find by ID
      let isValidObjectId = false;
      try {
        if (mongoose.Types.ObjectId.isValid(categoryIdOrName)) {
          // Only try to find by ID if it's a valid ObjectId
          category = await Category.findById(categoryIdOrName).exec();
          isValidObjectId = true;
        }
      } catch (error) {
        // If there's an error, we'll continue to search by name
        console.log("Error checking ObjectId validity:", error);
      }
      
      if (category) {
        // If found by ID, use its _id
        categoryRef = category._id;
      } else {
        // Try to find by name (case insensitive)
        category = await Category.findOne({ 
          name: { $regex: new RegExp(`^${categoryIdOrName}$`, 'i') } 
        }).exec();
        
        if (category) {
          // If found by name, use its _id
          categoryRef = category._id;
        } else {
          // If not found by name, check if it's a valid ObjectId
          try {
            // This will throw an error if categoryIdOrName is not a valid ObjectId format
            const categoryObjectId = mongoose.Types.ObjectId(categoryIdOrName);
            
            // Verify this ObjectId actually exists in the database
            const categoryExists = await Category.findById(categoryObjectId).exec();
            if (categoryExists) {
              categoryRef = categoryObjectId;
            } else {
              // If not found by ObjectId, create a new category with the provided name
              const newCategory = new Category({
                name: categoryIdOrName,
                user: req.userId // Associate with current user if categories are user-specific
              });
              
              const savedCategory = await newCategory.save();
              categoryRef = savedCategory._id;
              console.log(`Created new category: ${categoryIdOrName}`);
            }
          } catch (error) {
            // If not a valid ObjectId, create a new category with the provided name
            const newCategory = new Category({
              name: categoryIdOrName,
              user: req.userId // Associate with current user if categories are user-specific
            });
            
            const savedCategory = await newCategory.save();
            categoryRef = savedCategory._id;
            console.log(`Created new category: ${categoryIdOrName}`);
          }
        }
      }
    }

    const task = new Task({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      category: categoryRef,
      user: req.userId // Associate task with the logged-in user from authJwt middleware
    });

    const savedTask = await task.save();
    res.status(201).send(savedTask); // Send back the created task
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Task."
    });
  }
};

// Retrieve all tasks for the logged-in user, with sorting and filtering [cite: 5, 8]
exports.findAllTasks = async (req, res) => {
  const userId = req.userId;
  const { priority, dueDate, completed, category, sortBy, sortOrder, search } = req.query;

  try {
    let condition = { user: userId }; // Base condition: tasks belonging to the user

    // Filtering [cite: 5, 8]
    if (priority) condition.priority = priority;
    if (dueDate) condition.dueDate = { $lte: new Date(dueDate) }; // Example: find tasks due on or before this date
    if (completed !== undefined) condition.completed = completed === 'true'; // Filter by completion status
    
    // Handle category filtering with proper ID or name handling
    if (category) {
      const Category = db.category;
      
      let categoryDoc = null;
      
      // Check if the value is a valid ObjectId before trying to find by ID
      let isValidObjectId = false;
      try {
        if (mongoose.Types.ObjectId.isValid(category)) {
          // Only try to find by ID if it's a valid ObjectId
          categoryDoc = await Category.findById(category).exec();
          isValidObjectId = true;
        }
      } catch (error) {
        // If there's an error, we'll continue to search by name
        console.log("Error checking ObjectId validity:", error);
      }
      
      if (categoryDoc) {
        // If found by ID, use its _id
        condition.category = categoryDoc._id;
      } else {
        // Try to find by name (case insensitive)
        categoryDoc = await Category.findOne({ 
          name: { $regex: new RegExp(`^${category}$`, 'i') } 
        }).exec();
        
        if (categoryDoc) {
          // If found by name, use its _id
          condition.category = categoryDoc._id;
        } else {
          // If not found by name, check if it's a valid ObjectId
          try {
            // This will throw an error if category is not a valid ObjectId format
            const categoryObjectId = mongoose.Types.ObjectId(category);
            
            // Verify this ObjectId actually exists in the database
            const categoryExists = await Category.findById(categoryObjectId).exec();
            if (categoryExists) {
              condition.category = categoryObjectId;
            } else {
              return res.status(404).send({ 
                message: `Category with ID or name '${category}' not found.` 
              });
            }
          } catch (error) {
            return res.status(404).send({ 
              message: `Category with name '${category}' not found.` 
            });
          }
        }
      }
    }
    
    if (search) { // Search by title or description [cite: 8]
      condition.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive regex search
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Sorting [cite: 5]
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1; // Default to ascending
    } else {
      sortOptions.createdAt = -1; // Default sort by creation date descending
    }

    const tasks = await Task.find(condition)
      .populate("category", "name") // Populate category name [cite: 7]
      .sort(sortOptions)
      .exec();
      
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tasks."
    });
  }
};

// Find a single task by ID [cite: 6]
exports.findOneTask = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const task = await Task.findOne({ _id: id, user: userId }) // Ensure user owns the task
      .populate("category", "name")
      .exec();
      
    if (!task) {
      return res.status(404).send({ message: `Task not found with id=${id} or you don't have permission.` });
    }
    
    res.send(task);
  } catch (err) {
    // Handle potential CastError if ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: `Task not found with id=${id}.` });
    }
    res.status(500).send({ message: `Error retrieving Task with id=${id}.` });
  }
};

// Update a task by ID [cite: 6]
exports.updateTask = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  const id = req.params.id;
  const userId = req.userId;
  const updateData = { ...req.body };

  // Ensure user cannot update the 'user' field
  delete updateData.user;
  
  try {
    // Handle category update - ensure categoryId is valid if provided
    // Check for all possible category field names
    const categoryIdOrName = updateData.categoryId || updateData.category_id || updateData.category;
    
    if (categoryIdOrName === '') {
      updateData.category = null; // Allow unsetting category
    } else if (categoryIdOrName) {
      const Category = db.category;
      
      let category = null;
      
      // Check if the value is a valid ObjectId before trying to find by ID
      let isValidObjectId = false;
      try {
        if (mongoose.Types.ObjectId.isValid(categoryIdOrName)) {
          // Only try to find by ID if it's a valid ObjectId
          category = await Category.findById(categoryIdOrName).exec();
          isValidObjectId = true;
        }
      } catch (error) {
        // If there's an error, we'll continue to search by name
        console.log("Error checking ObjectId validity:", error);
      }
      
      if (category) {
        // If found by ID, use its _id
        updateData.category = category._id;
      } else {
        // Try to find by name (case insensitive)
        category = await Category.findOne({ 
          name: { $regex: new RegExp(`^${categoryIdOrName}$`, 'i') } 
        }).exec();
        
        if (category) {
          // If found by name, use its _id
          updateData.category = category._id;
        } else {
          // If not found by name, check if it's a valid ObjectId
          try {
            // This will throw an error if categoryIdOrName is not a valid ObjectId format
            const categoryObjectId = mongoose.Types.ObjectId(categoryIdOrName);
            
            // Verify this ObjectId actually exists in the database
            const categoryExists = await Category.findById(categoryObjectId).exec();
            if (categoryExists) {
              updateData.category = categoryObjectId;
            } else {
              // If not found by ObjectId, create a new category with the provided name
              const newCategory = new Category({
                name: categoryIdOrName,
                user: req.userId // Associate with current user if categories are user-specific
              });
              
              const savedCategory = await newCategory.save();
              updateData.category = savedCategory._id;
              console.log(`Created new category: ${categoryIdOrName}`);
            }
          } catch (error) {
            // If not a valid ObjectId, create a new category with the provided name
            const newCategory = new Category({
              name: categoryIdOrName,
              user: req.userId // Associate with current user if categories are user-specific
            });
            
            const savedCategory = await newCategory.save();
            updateData.category = savedCategory._id;
            console.log(`Created new category: ${categoryIdOrName}`);
          }
        }
      }
    }
    
    // Remove temporary fields
    delete updateData.categoryId;
    delete updateData.category_id;
    delete updateData.category; // Remove if it was used as a string name

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId }, 
      updateData, 
      { useFindAndModify: false, new: true }
    )
    .populate("category", "name")
    .exec();
    
    if (!updatedTask) {
      return res.status(404).send({
        message: `Cannot update Task with id=${id}. Maybe Task was not found or you don't have permission!`
      });
    }
    
    res.send({ message: "Task was updated successfully.", data: updatedTask });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: `Task not found with id=${id}.` });
    }
    res.status(500).send({ message: `Error updating Task with id=${id}: ${err.message}` });
  }
};

// Delete a task by ID [cite: 6]
exports.deleteTask = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId }).exec();
    
    if (!deletedTask) {
      return res.status(404).send({
        message: `Cannot delete Task with id=${id}. Maybe Task was not found or you don't have permission!`
      });
    }
    
    res.send({ message: "Task was deleted successfully!" });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: `Task not found with id=${id}.` });
    }
    res.status(500).send({ message: `Could not delete Task with id=${id}.` });
  }
};

// Optional: Delete all tasks for the user (use with caution!)
// exports.deleteAllTasks = (req, res) => {
//   Task.deleteMany({ user: req.userId })
//     .then(data => {
//       res.send({ message: `${data.deletedCount} Tasks were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message || "Some error occurred while removing all tasks." });
//     });
// };
