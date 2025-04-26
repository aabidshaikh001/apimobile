const AboutLocality = require("../models/aboutlocality");

exports.createOrUpdateLocality = async (req, res) => {
  const propertyId = req.params.id;
  const { localityDescription, localityFeatureName, localityFeatureDistance } = req.body;

  try {
    await AboutLocality.createOrUpdateLocality({
      propertyId,
      localityDescription,
      localityFeatureName: JSON.stringify(localityFeatureName),
      localityFeatureDistance: JSON.stringify(localityFeatureDistance)
    });

    res.status(200).json({ message: "Locality info saved successfully" });
  } catch (err) {
    console.error("❌ Error in createOrUpdateLocality:", err);
    res.status(500).json({ message: "Error saving locality info" });
  }
};

exports.getLocalityByPropertyId = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const locality = await AboutLocality.getLocalityByPropertyId(propertyId);
    if (!locality) {
      return res.status(404).json({ message: "Locality not found" });
    }

    res.status(200).json({
      ...locality,
      localityFeatureName: JSON.parse(locality.localityFeatureName || "[]"),
      localityFeatureDistance: JSON.parse(locality.localityFeatureDistance || "[]"),
    });
  } catch (err) {
    console.error("❌ Error in getLocalityByPropertyId:", err);
    res.status(500).json({ message: "Error fetching locality info" });
  }
};

exports.deleteLocality = async (req, res) => {
  const propertyId = req.params.id;

  try {
    await AboutLocality.deleteLocality(propertyId);
    res.status(200).json({ message: "Locality deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteLocality:", err);
    res.status(500).json({ message: "Error deleting locality" });
  }
};
