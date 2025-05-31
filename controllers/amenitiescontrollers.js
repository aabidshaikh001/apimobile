const Amenities = require("../models/Amenities");

// Create Table (optional, typically called once during setup)
const createTable = async (req, res) => {
    try {
        await Amenities.createTable();
        res.status(200).json({ success: true, message: "Amenities table created or already exists." });
    } catch (error) {
        console.error("Error creating table:", error);
        res.status(500).json({ success: false, message: "Error creating table." });
    }
};

// Insert Single Amenity
const insertAmenity = async (req, res) => {
    const { propertyId, REMAmenityCode, status } = req.body;
    if (!propertyId || !REMAmenityCode) {
        return res.status(400).json({ success: false, message: "propertyId and REMAmenityCode are required." });
    }

    try {
        await Amenities.insertAmenity(propertyId, { REMAmenityCode, status });
        res.status(201).json({ success: true, message: "Amenity inserted successfully." });
    } catch (error) {
        console.error("Error inserting amenity:", error);
        res.status(500).json({ success: false, message: "Error inserting amenity." });
    }
};

// Insert Multiple Amenities
const insertMultipleAmenities = async (req, res) => {
    const { propertyId, amenities } = req.body;
    if (!propertyId || !Array.isArray(amenities) || amenities.length === 0) {
        return res.status(400).json({ success: false, message: "propertyId and amenities array are required." });
    }

    try {
        await Amenities.insertMultipleAmenities(propertyId, amenities);
        res.status(201).json({ success: true, message: "Multiple amenities inserted successfully." });
    } catch (error) {
        console.error("Error inserting multiple amenities:", error);
        res.status(500).json({ success: false, message: "Error inserting multiple amenities." });
    }
};

// Get Amenities by Property ID
const getAmenitiesByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    if (!propertyId) {
        return res.status(400).json({ success: false, message: "propertyId is required." });
    }

    try {
        const amenities = await Amenities.getAmenitiesByPropertyId(propertyId);
        res.status(200).json({ success: true, data: amenities });
    } catch (error) {
        console.error("Error fetching amenities:", error);
        res.status(500).json({ success: false, message: "Error fetching amenities." });
    }
};

// Delete Amenities by Property ID
const deleteAmenitiesByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    if (!propertyId) {
        return res.status(400).json({ success: false, message: "propertyId is required." });
    }

    try {
        await Amenities.deleteAmenitiesByPropertyId(propertyId);
        res.status(200).json({ success: true, message: "Amenities deleted successfully." });
    } catch (error) {
        console.error("Error deleting amenities:", error);
        res.status(500).json({ success: false, message: "Error deleting amenities." });
    }
};

module.exports = {
    createTable,
    insertAmenity,
    insertMultipleAmenities,
    getAmenitiesByPropertyId,
    deleteAmenitiesByPropertyId
};
