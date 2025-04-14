// backend/controllers/user.controller.js
const db = require("../models");
const User = db.user;
const Task = db.task;
const Category = db.category;
const bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  // Accessible by logged-in users (verified by authJwt.verifyToken)
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  // Accessible only by admins (verified by authJwt.verifyToken and authJwt.isAdmin)
  res.status(200).send("Admin Content.");
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // Ensure the user is only accessing their own profile
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access to user profile." });
    }

    const user = await User.findById(req.userId)
      .select("-password -__v") // Exclude sensitive fields
      .populate("roles", "name -_id")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching user profile." });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    // Ensure the user is only updating their own profile
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access to update user profile." });
    }

    const updateData = { ...req.body };
    
    // Don't allow updating sensitive fields
    delete updateData.password;
    delete updateData.roles;
    delete updateData.email; // If email changes require verification

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, select: "-password -__v" }
    ).exec();

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error updating user profile." });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    // Ensure the user is only changing their own password
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access to change password." });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({ message: "Current password and new password are required." });
    }

    const user = await User.findById(req.userId).exec();

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Current password is incorrect." });
    }

    // Update password
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).send({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error changing password." });
  }
};

// Get user tasks
exports.getUserTasks = async (req, res) => {
  try {
    // Ensure the user is only accessing their own tasks
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access to user tasks." });
    }

    const tasks = await Task.find({ user: req.userId })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching user tasks." });
  }
};

// Get user categories
exports.getUserCategories = async (req, res) => {
  try {
    // Ensure the user is only accessing their own categories
    if (req.params.id !== req.userId && !req.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access to user categories." });
    }

    const categories = await Category.find({ user: req.userId })
      .sort({ name: 1 })
      .exec();

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching user categories." });
  }
};

// Get team members
exports.getTeamMembers = async (req, res) => {
  try {
    // For demo purposes, return some mock team members
    // In a real application, you would fetch actual team members from the database
    const mockTeamMembers = [
      { 
        id: 1, 
        username: "John Doe", 
        role: "UI Designer", 
        avatar: "https://via.placeholder.com/150" 
      },
      { 
        id: 2, 
        username: "Jane Smith", 
        role: "Frontend Developer", 
        avatar: "https://via.placeholder.com/150" 
      },
      { 
        id: 3, 
        username: "Alex Johnson", 
        role: "Backend Developer", 
        avatar: "https://via.placeholder.com/150" 
      }
    ];

    res.status(200).send(mockTeamMembers);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching team members." });
  }
};
