// backend/routes/auth.routes.js
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    // Set CORS headers - adjust origin in production
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Signup route with validation middleware [cite: 2]
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  // Signin route [cite: 3]
  app.post("/api/auth/signin", controller.signin);

  // Add email verification route if implementing [cite: 2]
  // app.get("/api/auth/verify/:token", controller.verifyEmail);
};