const PropertyValuationModel = require("../models/propertyvalutionmodel.js");
exports.getAllPropertyValuations = async (req, res) => {
  try {
    const propertyValuations = await PropertyValuationModel.getAll();
    res.status(200).json(propertyValuations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property valuations" });
  }
}
exports.createPropertyValuation = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming request
    const newPropertyValuation = await PropertyValuationModel.create(req.body);
    res.status(201).json({ message: "Property valuation created successfully", newPropertyValuation });
  } catch (error) {
    console.error("Error creating property valuation:", error); // Log error
    res.status(500).json({ error: "Failed to create property valuation", details: error.message });
  }
};
exports.deletePropertyValuation = async (req, res) => {
  try {
    await PropertyValuationModel.delete(req.params.id);
    res.status(200).json({ message: "Property valuation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property valuation" });
  }
};
exports.updatePropertyValuation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request Body:", req.body); // Log incoming request
    await PropertyValuationModel
      .update(id, req.body);    // Update property valuation
    res.status(200).json({ message: "Property valuation updated successfully" });
    } catch (error) {
    console.error("Error updating property valuation:", error); // Log error
    res.status(500).json({ error: "Failed to update property valuation", details: error.message });
    }
}