const ProjectDetails = require("../models/projectDetailsModel");

const createProjectDetails = async (req, res) => {
 try {
    const { propertyId, projectDetailLabel, projectDetailValue } = req.body;
    const result = await ProjectDetails.create({ propertyId, projectDetailLabel, projectDetailValue });
    res.status(201).json({ success: true, message: "Project detail created successfully", result });
  } catch (error) {
    console.error("Error creating project detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await ProjectDetails.getByPropertyId(propertyId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectDetailLabel, projectDetailValue } = req.body;
    const result = await ProjectDetails.updateByProjectId({ projectId: parseInt(projectId), projectDetailLabel, projectDetailValue });
    res.status(200).json({ success: true, message: "Project detail updated successfully", result });
  } catch (error) {
    console.error("Error updating project detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createProjectDetails,
  getProjectDetails,
  updateProjectDetails,
};
