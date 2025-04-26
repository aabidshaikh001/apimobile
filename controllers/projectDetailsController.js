const ProjectDetails = require("../models/projectDetailsModel");

const createProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectDetailLabel, projectDetailValue } = req.body;

    await ProjectDetails.create({
      propertyId: id,
      projectDetailLabel,
      projectDetailValue,
    });

    res.status(201).json({ message: "Project details created successfully." });
  } catch (error) {
    console.error("❌ Error creating project details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const data = await ProjectDetails.getByPropertyId(propertyId);

    if (!data) {
      return res.status(404).json({ message: "Project details not found." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching project details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectDetailLabel, projectDetailValue } = req.body;

    await ProjectDetails.updateByPropertyId({
      propertyId: id,
      projectDetailLabel,
      projectDetailValue,
    });

    res.status(200).json({ message: "Project details updated successfully." });
  } catch (error) {
    console.error("❌ Error updating project details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProjectDetails,
  getProjectDetails,
  updateProjectDetails,
};
