const JobModel = require("../models/jobModel.js");

exports.createJob = async (req, res) => {
  try {
    const newJob = await JobModel.createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: "Error creating job", details: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobModel.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs", details: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await JobModel.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job", details: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const response = await JobModel.deleteJob(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error deleting job", details: error.message });
  }
};
