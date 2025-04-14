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

    // Log the category reference for debugging
    if (categoryRef) {
      console.log(`Using category reference: ${categoryRef} for task: ${title}`);
    }

    const task = new Task({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority || 'medium',
      status: req.body.status || 'todo',
      progress: req.body.progress || 0,
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

    // Add debug logging to see what's happening with categories
    console.log("Finding tasks with condition:", JSON.stringify(condition));
    
    const tasks = await Task.find(condition)
      .populate("category", "name") // Populate category name [cite: 7]
      .sort(sortOptions)
      .exec();
    
    // Log the first few tasks to see if categories are populated
    if (tasks.length > 0) {
      console.log("Sample task category data:", JSON.stringify(tasks[0].category));
      console.log("Sample task full data:", JSON.stringify(tasks[0]));
    }
      
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
    
    // Remove temporary fields but keep the category field if it was set to a valid ObjectId
    delete updateData.categoryId;
    delete updateData.category_id;
    
    // Only delete the category field if it was a string name and we've already processed it
    // This ensures we don't lose the category reference we just set
    if (typeof categoryIdOrName === 'string' && updateData.category && typeof updateData.category !== 'string') {
      // We've already processed the category string and set updateData.category to an ObjectId
      // So we don't need to do anything here
    } else if (categoryIdOrName === undefined) {
      // If no category was provided in the update, don't modify the existing category
    } else if (categoryIdOrName === '') {
      // If an empty string was provided, explicitly set category to null (uncategorize)
      updateData.category = null;
    }
    
    // Update progress based on status if not explicitly provided
    if (updateData.status && !updateData.progress) {
      switch (updateData.status) {
        case 'todo':
          updateData.progress = 0;
          break;
        case 'in-progress':
          updateData.progress = 50;
          break;
        case 'review':
          updateData.progress = 75;
          break;
        case 'completed':
          updateData.progress = 100;
          break;
      }
    }

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

// Mark a task as completed
exports.markTaskAsCompleted = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { status: 'completed', progress: 100 },
      { useFindAndModify: false, new: true }
    )
    .populate("category", "name")
    .exec();
    
    if (!updatedTask) {
      return res.status(404).send({
        message: `Cannot mark Task with id=${id} as completed. Maybe Task was not found or you don't have permission!`
      });
    }
    
    res.send({ message: "Task was marked as completed successfully.", data: updatedTask });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: `Task not found with id=${id}.` });
    }
    res.status(500).send({ message: `Error marking Task with id=${id} as completed: ${err.message}` });
  }
};

// Mark a task as incomplete
exports.markTaskAsIncomplete = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { status: 'in-progress', progress: 50 },
      { useFindAndModify: false, new: true }
    )
    .populate("category", "name")
    .exec();
    
    if (!updatedTask) {
      return res.status(404).send({
        message: `Cannot mark Task with id=${id} as incomplete. Maybe Task was not found or you don't have permission!`
      });
    }
    
    res.send({ message: "Task was marked as incomplete successfully.", data: updatedTask });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: `Task not found with id=${id}.` });
    }
    res.status(500).send({ message: `Error marking Task with id=${id} as incomplete: ${err.message}` });
  }
};

// Get tasks due today
exports.getTasksForToday = async (req, res) => {
  const userId = req.userId;
  
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find tasks due today
    const tasks = await Task.find({
      user: userId,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate("category", "name")
    .sort({ priority: -1 }) // Sort by priority (high to low)
    .exec();
    
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tasks for today."
    });
  }
};

// Get tasks due this week
exports.getTasksForWeek = async (req, res) => {
  const userId = req.userId;
  
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get date 7 days from now at midnight
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Find tasks due this week
    const tasks = await Task.find({
      user: userId,
      dueDate: {
        $gte: today,
        $lt: nextWeek
      }
    })
    .populate("category", "name")
    .sort({ dueDate: 1 }) // Sort by due date (ascending)
    .exec();
    
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tasks for this week."
    });
  }
};

// Get tasks due this month
exports.getTasksForMonth = async (req, res) => {
  const userId = req.userId;
  
  try {
    // Get first day of current month at midnight
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    // Get first day of next month at midnight
    const firstDayOfNextMonth = new Date(firstDayOfMonth);
    firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1);
    
    // Find tasks due this month
    const tasks = await Task.find({
      user: userId,
      dueDate: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    })
    .populate("category", "name")
    .sort({ dueDate: 1 }) // Sort by due date (ascending)
    .exec();
    
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tasks for this month."
    });
  }
};

// Get completed tasks
exports.getCompletedTasks = async (req, res) => {
  const userId = req.userId;
  
  try {
    // Find completed tasks
    const tasks = await Task.find({
      user: userId,
      status: 'completed'
    })
    .populate("category", "name")
    .sort({ updatedAt: -1 }) // Sort by completion date (descending)
    .exec();
    
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving completed tasks."
    });
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
