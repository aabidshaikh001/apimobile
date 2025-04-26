const AboutProject = require("../models/AboutProject");

exports.createAboutProject = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { projectName, projectDescription, projectDetails } = req.body;

  try {
    const result = await AboutProject.create({ propertyId, projectName, projectDescription, projectDetails });
    res.status(201).json({ message: "About Project created", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAboutProject = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    const result = await AboutProject.getByPropertyId(propertyId);
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAboutProject = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { projectName, projectDescription, projectDetails } = req.body;

  try {
    const result = await AboutProject.update(propertyId, { projectName, projectDescription, projectDetails });
    res.status(200).json({ message: "Project updated", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
