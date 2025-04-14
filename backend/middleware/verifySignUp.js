// backend/middleware/verifySignUp.js
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check Username
  User.findOne({ username: req.body.username }).exec()
    .then(user => {
      if (user) {
        return res.status(400).send({ message: "Failed! Username is already in use!" });
      }

      // Check Email
      User.findOne({ email: req.body.email }).exec()
        .then(user => {
          if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
          }
          next(); // Continue if username and email are unique
        })
        .catch(err => {
          res.status(500).send({ message: err.message || "Error checking email uniqueness." });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error checking username uniqueness." });
    });
};


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
      }
    }
  }
  next(); // Continue if roles are valid or not provided (defaults to 'user')
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;