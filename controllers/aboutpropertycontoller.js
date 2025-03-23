import AboutProperty from "../models/AboutProperty.js";

// Create AboutProperty
export const createAboutProperty = async (req, res) => {
    try {
        const { propertyId, description } = req.body;

        if (!propertyId || !description) {
            return res.status(400).json({ message: "Property ID and description are required." });
        }

        await AboutProperty.insertAboutProperty(propertyId, description);
        res.status(201).json({ message: "AboutProperty added successfully." });
    } catch (error) {
        console.error("Error creating AboutProperty:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get AboutProperty by Property ID
export const getAboutPropertyByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const aboutProperty = await AboutProperty.getAboutPropertyByPropertyId(propertyId);

        if (!aboutProperty) {
            return res.status(404).json({ message: "AboutProperty not found." });
        }

        res.status(200).json(aboutProperty);
    } catch (error) {
        console.error("Error fetching AboutProperty:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update AboutProperty
export const updateAboutProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Description is required." });
        }

        await AboutProperty.updateAboutProperty(propertyId, description);
        res.status(200).json({ message: "AboutProperty updated successfully." });
    } catch (error) {
        console.error("Error updating AboutProperty:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete AboutProperty
export const deleteAboutProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        await AboutProperty.deleteAboutProperty(propertyId);
        res.status(200).json({ message: "AboutProperty deleted successfully." });
    } catch (error) {
        console.error("Error deleting AboutProperty:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
