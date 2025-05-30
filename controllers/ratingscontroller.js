const Rating = require("../models/Rating");

exports.insertRating = async (req, res) => {
    try {
        const { propertyId, name, avatar, rating, review } = req.body;
        if (!propertyId || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Invalid data. Rating must be between 1 and 5, and propertyId is required." });
        }

        await Rating.insertRating({ propertyId, name, avatar, rating, review });
        res.status(201).json({ message: "Rating added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding rating", details: error.message });
    }
};

exports.getRatingsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const ratings = await Rating.getRatingsByPropertyId(propertyId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching ratings", details: error.message });
    }
};

exports.deleteRatingById = async (req, res) => {
    try {
        const { id } = req.params;
        await Rating.deleteRatingById(id);
        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting rating", details: error.message });
    }
};

exports.deleteRatingsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await Rating.deleteRatingsByPropertyId(propertyId);
        res.status(200).json({ message: "All ratings for property deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting ratings", details: error.message });
    }
};
