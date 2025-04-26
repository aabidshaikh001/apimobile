const PaymentPlan = require("../models/PaymentPlan.js"); 

exports.insertPaymentPlan = async (req, res) => {
    try {
        const { propertyId, payment, milestone } = req.body;
        await PaymentPlan.insertPaymentPlan({ propertyId, payment, milestone });
        res.status(201).json({ message: "Payment plan added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding payment plan", details: error.message });
    }
};

exports.getPaymentPlansByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const paymentPlans = await PaymentPlan.getPaymentPlansByPropertyId(propertyId);
        res.status(200).json(paymentPlans);
    } catch (error) {
        res.status(500).json({ error: "Error fetching payment plans", details: error.message });
    }
};

exports.deletePaymentPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        await PaymentPlan.deletePaymentPlanById(id);
        res.status(200).json({ message: "Payment plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting payment plan", details: error.message });
    }
};

exports.deletePaymentPlansByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await PaymentPlan.deletePaymentPlansByPropertyId(propertyId);
        res.status(200).json({ message: "All payment plans for property deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting payment plans", details: error.message });
    }
};
