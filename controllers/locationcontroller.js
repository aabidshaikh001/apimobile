const AboutLocation = require("../models/Location");

exports.addLocationByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { icon, label, distance } = req.body;

    await AboutLocation.insertLocation({
      propertyId,
      icon,
      label,
      distance,
    });

    res.status(201).json({ message: "Location added successfully." });
  } catch (error) {
    console.error("Error in addLocationByPropertyId:", error);
    res.status(500).json({ error: "Failed to add location." });
  }
};

exports.getLocationsByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const locations = await AboutLocation.getLocationsByPropertyId(propertyId);
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error in getLocationsByPropertyId:", error);
    res.status(500).json({ error: "Failed to fetch locations." });
  }
};

exports.deleteLocationsByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.id;
    await AboutLocation.deleteLocationsByPropertyId(propertyId);
    res.status(200).json({ message: "Locations deleted successfully." });
  } catch (error) {
    console.error("Error in deleteLocationsByPropertyId:", error);
    res.status(500).json({ error: "Failed to delete locations." });
  }
};
