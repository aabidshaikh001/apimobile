const Brochures = require("../models/brochure");

exports.upsertBrochure = async (req, res) => {
    try {
        const { propertyId, title, logo, pdfLink } = req.body;
        await Brochures.upsertBrochure({ propertyId, title, logo, pdfLink });
        res.status(200).json({ message: "Brochure added or updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error upserting brochure", details: error.message });
    }
};

exports.getBrochureByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const brochure = await Brochures.getBrochureByPropertyId(propertyId);
        if (brochure) {
            res.status(200).json(brochure);
        } else {
            res.status(404).json({ error: "Brochure not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching brochure", details: error.message });
    }
};

exports.deleteBrochureByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await Brochures.deleteBrochureByPropertyId(propertyId);
        res.status(200).json({ message: "Brochure deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting brochure", details: error.message });
    }
};
