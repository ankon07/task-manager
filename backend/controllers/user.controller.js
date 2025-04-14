// backend/controllers/user.controller.js
// Example controllers for accessing role-protected content

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
  
  // Add more user-specific controllers here if needed (e.g., get profile, update profile)
  // const User = require('../models').user;
  // exports.getUserProfile = (req, res) => {
  //   User.findById(req.userId, { password: 0, emailVerificationToken: 0 }) // Exclude sensitive fields
  //     .populate("roles", "-__v")
  //     .exec()
  //     .then(user => {
  //       if (!user) {
  //         return res.status(404).send({ message: "User not found." });
  //       }
  //       res.status(200).send(user);
  //     })
  //     .catch(err => res.status(500).send({ message: err.message || "Error fetching user profile." }));
  // };