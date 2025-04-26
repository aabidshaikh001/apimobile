const Properties = require("../models/Properties.js");
exports.getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Properties.getPropertyById(id);
    
        if (!property) {
        return res.status(404).json({ message: "Property not found" });
        }
    
        res.status(200).json(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Properties.getAllProperties();
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.insertProperty = async (req, res) => {
    try {
        const property = req.body;
        await Properties.insertProperty(property);
        res.status(201).json({ message: "Property inserted successfully" });
    } catch (error) {
        console.error("Error inserting property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = req.body;
        await Properties.updateProperty(id, property);
        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        await Properties.deleteProperty(id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getFeaturedProperties = async (req, res) => {
    try {
        const properties = await Properties.getFeaturedProperties();
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching featured properties:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getSavedProperties = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming userId is passed in the request parameters
        const properties = await Properties.getSavedProperties(userId);
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching saved properties:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}