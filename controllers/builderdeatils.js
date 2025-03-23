import BuilderDetails from "../models/BuilderDeatails.js";

export const upsertBuilderDetails = async (req, res) => {
    try {
        const { propertyId, name, established, logo, overview, experience, certifications, projects } = req.body;
        await BuilderDetails.upsertBuilderDetails({ propertyId, name, established, logo, overview, experience, certifications, projects });
        res.status(200).json({ message: "Builder details added or updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error upserting builder details", details: error.message });
    }
};

export const getBuilderDetailsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const builderDetails = await BuilderDetails.getBuilderDetailsByPropertyId(propertyId);
        if (builderDetails) {
            res.status(200).json(builderDetails);
        } else {
            res.status(404).json({ error: "Builder details not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching builder details", details: error.message });
    }
};

export const deleteBuilderDetailsByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await BuilderDetails.deleteBuilderDetailsByPropertyId(propertyId);
        res.status(200).json({ message: "Builder details deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting builder details", details: error.message });
    }
};
