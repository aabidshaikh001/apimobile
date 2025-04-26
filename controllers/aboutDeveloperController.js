const AboutDeveloper = require("../models/AboutDeveloper");

exports.createAboutDeveloper = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { developerName, developerDescription, developerAwards, developerImage } = req.body;

  try {
    await AboutDeveloper.create({
      propertyId,
      developerName,
      developerDescription,
      developerAwards,
      developerImage
    });
    res.status(201).json({ message: "Developer info created successfully." });
  } catch (error) {
    console.error("❌ Error creating developer:", error.message);
    res.status(500).json({ error: "Failed to create developer info." });
  }
};

exports.getAboutDeveloper = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    const developer = await AboutDeveloper.getByPropertyId(propertyId);
    if (!developer) {
      return res.status(404).json({ error: "Developer info not found." });
    }

    // Parse developerAwards back to array
    developer.developerAwards = JSON.parse(developer.developerAwards || "[]");

    res.status(200).json(developer);
  } catch (error) {
    console.error("❌ Error fetching developer:", error.message);
    res.status(500).json({ error: "Failed to fetch developer info." });
  }
};

exports.updateAboutDeveloper = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { developerName, developerDescription, developerAwards, developerImage } = req.body;

  try {
    await AboutDeveloper.update(propertyId, {
      developerName,
      developerDescription,
      developerAwards,
      developerImage
    });
    res.status(200).json({ message: "Developer info updated successfully." });
  } catch (error) {
    console.error("❌ Error updating developer:", error.message);
    res.status(500).json({ error: "Failed to update developer info." });
  }
};
