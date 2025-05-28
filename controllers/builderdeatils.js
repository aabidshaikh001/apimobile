const Builder = require("../models/BuilderDeatails");

// Create a new builder
// Create a new builder
exports.createBuilder = async (req, res) => {
  try {
    const data = { ...req.body };

    // Stringify socialLinks if it's an object
    if (data.socialLinks && typeof data.socialLinks === "object") {
      data.socialLinks = JSON.stringify(data.socialLinks);
    }

    const builderId = await Builder.create(data);
    res.status(201).json({ builderId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get builder by ID
exports.getBuilderById = async (req, res) => {
  try {
    const builder = await Builder.getById(req.params.id);
    if (!builder) return res.status(404).json({ message: "Builder not found" });
    res.status(200).json(builder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all builders
exports.getAllBuilders = async (req, res) => {
  try {
    const builders = await Builder.getAll();
    res.status(200).json(builders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update builder
exports.updateBuilder = async (req, res) => {
  try {
    const updated = await Builder.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Builder not found" });
    res.status(200).json({ message: "Builder updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete builder
exports.deleteBuilder = async (req, res) => {
  try {
    const deleted = await Builder.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Builder not found" });
    res.status(200).json({ message: "Builder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get builder with projects and properties
exports.getBuilderWithDetails = async (req, res) => {
  try {
    const builderDetails = await Builder.getWithDetails(req.params.id);
    if (!builderDetails) return res.status(404).json({ message: "Builder not found" });
    res.status(200).json(builderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
