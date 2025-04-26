const HomeLoanModel = require("../models/Homeloanmodal.js");
exports.createHomeLoan = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log incoming request
        const newHomeLoan = await HomeLoanModel.create(req.body);
        res.status(201).json({ message: "Home loan created successfully", newHomeLoan });
    } catch (error) {
        console.error("Error creating home loan:", error); // Log error
        res.status(500).json({ error: "Failed to create home loan", details: error.message });
    }
};
exports.getAllHomeLoans = async (req, res) => {
    try {
        const homeLoans = await HomeLoanModel.getAll();
        res.status(200).json(homeLoans);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch home loans" });
    }
}
