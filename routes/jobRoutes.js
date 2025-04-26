const express = require("express")
const  { createJob, getAllJobs, getJobById, deleteJob } = require("../controllers/jobController.js");

const router = express.Router();

router.post("/", createJob); // Create a job
router.get("/", getAllJobs); // Get all jobs
router.get("/:id", getJobById); // Get a job by ID
router.delete("/:id", deleteJob); // Delete a job by ID

module.exports = router;
