// backend/controllers/auth.controller.js
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
// const emailUtil = require("../utils/email.util"); // For email verification [cite: 2]

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto'); // For generating verification token

exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Basic validation [cite: 17]
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Username, email, and password are required." });
    }

    const user = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8), // Hash password [cite: 3]
    });

    const savedUser = await user.save();

    // Assign roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } }).exec();
      savedUser.roles = foundRoles.map(role => role._id);
      await savedUser.save();
    } else {
      // Assign default 'user' role
      const userRole = await Role.findOne({ name: "user" }).exec();
      if (!userRole) {
        // Handle case where 'user' role doesn't exist (should be initialized)
        return res.status(500).send({ message: "Default user role not found. Please initialize roles." });
      }
      savedUser.roles = [userRole._id];
      await savedUser.save();
    }

    // Send verification email (implement in email.util.js) [cite: 2]
    // emailUtil.sendVerificationEmail(savedUser.email, savedUser.emailVerificationToken);
    res.send({ message: "User registered successfully! Please check your email to verify your account." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error registering user." });
  }
};

// Add email verification controller function here if implementing [cite: 2]
// exports.verifyEmail = async (req, res) => { ... }

exports.signin = async (req, res) => {
  try {
    // Support both formats: {usernameOrEmail, password} or {username/email, password}
    const usernameOrEmail = req.body.usernameOrEmail || req.body.username || req.body.email;
    const { password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).send({ message: "Username/Email and password are required." });
    }

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })
    .populate("roles", "-__v") // Populate roles, exclude __v field
    .exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Check if email is verified (if implementing) [cite: 2]
    // if (!user.emailVerified) {
    //   return res.status(401).send({ message: "Account not verified. Please check your email." });
    // }

    const passwordIsValid = bcrypt.compareSync(password, user.password); // [cite: 3]

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // Generate JWT [cite: 3, 16]
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours (adjust as needed)
    });

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error during sign in." });
  }
};
