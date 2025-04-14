// backend/routes/task.routes.js
const { authJwt } = require("../middleware");
const tasksController = require("../controllers/task.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // All task routes require a valid token [cite: 16]
  const requireAuth = [authJwt.verifyToken];
  // If you need specific ownership/admin checks for update/delete:
  // const requireOwnerOrAdmin = [authJwt.verifyToken, authJwt.isOwnerOrAdmin(require('../models').task)];


  // Create a new Task [cite: 4]
  app.post("/api/tasks", requireAuth, tasksController.createTask);

  // Retrieve all Tasks for the user (with filtering/sorting) [cite: 5, 8]
  app.get("/api/tasks", requireAuth, tasksController.findAllTasks);

  // Retrieve a single Task with id [cite: 6]
  app.get("/api/tasks/:id", requireAuth, tasksController.findOneTask);

  // Update a Task with id [cite: 6]
  // Use requireOwnerOrAdmin if you want only owner or admin to update
  app.put("/api/tasks/:id", requireAuth, tasksController.updateTask);

  // Delete a Task with id [cite: 6]
   // Use requireOwnerOrAdmin if you want only owner or admin to delete
  app.delete("/api/tasks/:id", requireAuth, tasksController.deleteTask);

  // Optional: Delete all Tasks (use with caution!)
  // app.delete("/api/tasks", requireAuth, tasksController.deleteAllTasks);
};