const PartnerSection = require("../models/PartnerSection");

exports.getPartnerSection = async (req, res) => {
  try {
    const data = await PartnerSection.getPartnerSection();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching partner section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPartnerSection = async (req, res) => {
  try {
    const partnerSection = req.body;
    const data = await PartnerSection.createPartnerSection(partnerSection);
    res.status(201).json({ success: true, message: "Created successfully", data });
  } catch (error) {
    console.error("Error creating partner section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePartnerSection = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partnerSection = req.body;
    const data = await PartnerSection.updatePartnerSection(id, partnerSection);
    res.status(200).json({ success: true, message: "Updated successfully", data });
  } catch (error) {
    console.error("Error updating partner section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePartnerSection = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await PartnerSection.deletePartnerSection(id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
