const express = require("express");
const router = express.Router();
const {
  createProjectDetails,
  getProjectDetails,
  updateProjectDetails
} = require("../controllers/projectDetailsController");

// POST /api/project-details/:id
router.post("/:id", createProjectDetails);

// GET /api/project-details/:propertyId
router.get("/:propertyId", getProjectDetails);

// PUT /api/project-details/:id
router.put("/:id", updateProjectDetails);

module.exports = router;
