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

  // Get team members - This specific route must come before the parameterized routes
  app.get(
    "/api/users/team",
    [authJwt.verifyToken],
    controller.getTeamMembers
  );

  // Get user profile
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken],
    controller.getUserProfile
  );

  // Update user profile
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken],
    controller.updateUserProfile
  );

  // Change password
  app.post(
    "/api/users/:id/change-password",
    [authJwt.verifyToken],
    controller.changePassword
  );

  // Get user tasks
  app.get(
    "/api/users/:id/tasks",
    [authJwt.verifyToken],
    controller.getUserTasks
  );

  // Get user categories
  app.get(
    "/api/users/:id/categories",
    [authJwt.verifyToken],
    controller.getUserCategories
  );
};
