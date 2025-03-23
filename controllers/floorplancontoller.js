import FloorPlan from "../models/FloorPlan.js";

export const upsertFloorPlan = async (req, res) => {
    try {
        const { propertyId, bhk, area, price, pricePerSqft } = req.body;
        await FloorPlan.upsertFloorPlan({ propertyId, bhk, area, price, pricePerSqft });
        res.status(200).json({ message: "Floor plan added or updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error upserting floor plan", details: error.message });
    }
};

export const getFloorPlanByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const floorPlan = await FloorPlan.getFloorPlanByPropertyId(propertyId);
        if (floorPlan) {
            res.status(200).json(floorPlan);
        } else {
            res.status(404).json({ error: "Floor plan not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching floor plan", details: error.message });
    }
};

export const deleteFloorPlanByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await FloorPlan.deleteFloorPlanByPropertyId(propertyId);
        res.status(200).json({ message: "Floor plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting floor plan", details: error.message });
    }
};
