import Amenities from "../models/Amenities.js";

// Create Amenity
export const createAmenity = async (req, res) => {
    try {
        const { propertyId, icon, label } = req.body;

        if (!propertyId || !icon || !label) {
            return res.status(400).json({ message: "Property ID, icon, and label are required." });
        }

        await Amenities.insertAmenity(propertyId, { icon, label });
        res.status(201).json({ message: "Amenity added successfully." });
    } catch (error) {
        console.error("Error creating amenity:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get Amenities by Property ID
export const getAmenitiesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const amenities = await Amenities.getAmenitiesByPropertyId(propertyId);

        if (!amenities || amenities.length === 0) {
            return res.status(404).json({ message: "No amenities found for this property." });
        }

        res.status(200).json(amenities);
    } catch (error) {
        console.error("Error fetching amenities:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete Amenities by Property ID
export const deleteAmenitiesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;

        await Amenities.deleteAmenitiesByPropertyId(propertyId);
        res.status(200).json({ message: "Amenities deleted successfully." });
    } catch (error) {
        console.error("Error deleting amenities:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
