// backend/middleware/index.js
const authJwt = require("./auth.jwt");
const verifySignUp = require("./verifySignUp");

module.exports = {
  authJwt,
  verifySignUp
};