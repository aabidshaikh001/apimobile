const express = require("express");
const router = express.Router();
const projectController = require("../controllers/aboutProjectController");

router.post("/", projectController.createProject); // Create project
router.get("/:id", projectController.getProjectById); // Get project by ID
router.put("/:id", projectController.updateProject); // Update project
router.delete("/:id", projectController.deleteProject); // Delete project
router.get("/builder/:builderId", projectController.getProjectsByBuilder); // Get all projects by builder
router.get("/with-properties/:id", projectController.getProjectWithProperties); // Get project with properties

module.exports = router;
