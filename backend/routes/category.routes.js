// backend/routes/category.routes.js
const { authJwt } = require("../middleware");
const categoriesController = require("../controllers/category.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Authentication middleware [cite: 16]
    // Apply verifyToken to all category routes as users likely manage their own categories or admins manage global ones.
    // Apply isAdmin if only admins should manage categories.
    const requireAuth = [authJwt.verifyToken];
    const requireAdmin = [authJwt.verifyToken, authJwt.isAdmin];

    // Create a new Category [cite: 7]
    // Decide if only admins (requireAdmin) or any logged-in user (requireAuth) can create
    app.post("/api/categories", requireAuth, categoriesController.createCategory);

    // Retrieve all Categories
    // Accessible to all logged-in users
    app.get("/api/categories", requireAuth, categoriesController.findAllCategories);

    // Retrieve a single Category with id
    app.get("/api/categories/:id", requireAuth, categoriesController.findOneCategory);

    // Update a Category with id
    // Decide if only admins (requireAdmin) or any logged-in user (requireAuth) can update
    app.put("/api/categories/:id", requireAuth, categoriesController.updateCategory);

    // Delete a Category with id
    // Decide if only admins (requireAdmin) or any logged-in user (requireAuth) can delete
    app.delete("/api/categories/:id", requireAuth, categoriesController.deleteCategory);
};