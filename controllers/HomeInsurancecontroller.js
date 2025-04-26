const HomeInsuranceModel = require("../models/HomeInsurancemodel.js")
exports.createHomeInsurance = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log incoming request
        const newHomeInsurance = await HomeInsuranceModel.create(req.body);
        res.status(201).json({ message: "Home insurance created successfully", newHomeInsurance });
    } catch (error) {
        console.error("Error creating home insurance:", error); // Log error
        res.status(500).json({ error: "Failed to create home insurance", details: error.message });
    }
};
exports.getAllHomeInsurances = async (req, res) => {
    try {
        const homeInsurances = await HomeInsuranceModel.getAll();
        res.status(200).json(homeInsurances);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch home insurances" });
    }
}
