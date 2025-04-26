const JobformModel = require("../models/jobformModel.js");
const cloudinary = require("../cloudinary.js");
const fs = require("fs");

exports.getJobApplications = async (req, res) => {
  try {
    const applications = await JobformModel.getAllJobApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getJobApplications:", error);
    res.status(500).json({ error: "Error getting job applications" });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const { name, email, phone, coverLetter, jobTitle } = req.body;
    const file = req.file;


    // Validate file
    if (!file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Validate file type (only allow PDFs)
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    // Validate file size (limit to 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      return res.status(400).json({ error: "File size must be less than 5MB" });
    }

    // Upload file to Cloudinary as a raw document
    let result;
    try {
     
      result = await cloudinary.uploader.upload(file.path, {
        folder: "resumes",
        resource_type: "raw", // Ensures it's treated as a document
      });
      ;
    } catch (uploadError) {
      console.error("Error uploading file to Cloudinary:", uploadError);
      return res.status(500).json({ error: "Error uploading resume" });
    }

    // Save application to database
    try {
      await JobformModel.createJobApplication({
        name,
        email,
        phone,
        coverLetter,
        jobTitle,
        resumeUrl: result.secure_url,
      });
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (dbError) {
      console.error("Error saving application to database:", dbError);
      res.status(500).json({ error: "Error submitting application" });
    }

    // Delete the local file after upload
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      
    }
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(500).json({ error: "Error submitting application" });
  }
};
