const Amenities = require("../models/Amenities");

const amenitiesController = {
    // Insert multiple amenities
    create: async (req, res) => {
        const { propertyId } = req.params;
        const amenities = req.body;

        if (!Array.isArray(amenities) || amenities.length === 0) {
            return res.status(400).json({ error: "Amenities should be a non-empty array." });
        }

        try {
            await Amenities.insertMultipleAmenities(propertyId, amenities);
            res.status(201).json({ message: "Amenities added successfully." });
        } catch (error) {
            console.error("Error in create controller:", error);
            res.status(500).json({ error: "Failed to add amenities." });
        }
    },

    // Get amenities by property ID
    getByPropertyId: async (req, res) => {
        const { propertyId } = req.params;
        try {
            const data = await Amenities.getAmenitiesByPropertyId(propertyId);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching amenities:", error);
            res.status(500).json({ error: "Failed to fetch amenities." });
        }
    },

    // Delete all amenities by property ID
    deleteByPropertyId: async (req, res) => {
        const { propertyId } = req.params;
        try {
            await Amenities.deleteAmenitiesByPropertyId(propertyId);
            res.status(200).json({ message: "Amenities deleted successfully." });
        } catch (error) {
            console.error("Error deleting amenities:", error);
            res.status(500).json({ error: "Failed to delete amenities." });
        }
    }
};

module.exports = amenitiesController;
