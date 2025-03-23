import AboutLocation from "../models/Location.js";

export const insertLocation = async (req, res) => {
    try {
        const { propertyId, icon, label, distance } = req.body;
        await AboutLocation.insertLocation({ propertyId, icon, label, distance });
        res.status(201).json({ message: "Location added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding location", details: error.message });
    }
};

export const getLocationsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const locations = await AboutLocation.getLocationsByPropertyId(propertyId);
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching locations", details: error.message });
    }
};

export const deleteLocationsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await AboutLocation.deleteLocationsByPropertyId(propertyId);
        res.status(200).json({ message: "Locations deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting locations", details: error.message });
    }
};
