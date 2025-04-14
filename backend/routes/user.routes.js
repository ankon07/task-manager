// backend/routes/user.routes.js
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Publicly accessible route
  app.get("/api/test/all", controller.allAccess);

  // Route accessible only to logged-in users (any role) [cite: 16]
  app.get(
    "/api/test/user",
    [authJwt.verifyToken], // Verify JWT
    controller.userBoard
  );

   // Route accessible only to admin users [cite: 2, 16]
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin], // Verify JWT and check for admin role
    controller.adminBoard
  );

  // Add other user-related routes (e.g., get profile)
  // app.get(
  //   "/api/user/profile",
  //   [authJwt.verifyToken],
  //   controller.getUserProfile
  // );
};