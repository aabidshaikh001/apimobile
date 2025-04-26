const FloorPlan = require("../models/FloorPlan");

exports.addFloorPlanByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { name, image, area, bedrooms, bathrooms } = req.body;

    await FloorPlan.addFloorPlan({
      propertyId,
      name,
      image,
      area,
      bedrooms,
      bathrooms
    });

    res.status(201).json({ message: "Floor plan added successfully." });
  } catch (error) {
    console.error("Controller error (addFloorPlanByPropertyId):", error);
    res.status(500).json({ error: "Failed to add floor plan." });
  }
};

exports.getFloorPlansByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const floorPlans = await FloorPlan.getFloorPlansByPropertyId(propertyId);
    res.status(200).json(floorPlans);
  } catch (error) {
    console.error("Controller error (getFloorPlansByPropertyId):", error);
    res.status(500).json({ error: "Failed to fetch floor plans." });
  }
};

exports.deleteFloorPlansByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    await FloorPlan.deleteFloorPlansByPropertyId(propertyId);
    res.status(200).json({ message: "Floor plans deleted successfully." });
  } catch (error) {
    console.error("Controller error (deleteFloorPlansByPropertyId):", error);
    res.status(500).json({ error: "Failed to delete floor plans." });
  }
};
