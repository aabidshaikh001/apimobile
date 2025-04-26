const customermodel = require("../models/customermodel");

exports.createCustomer = async (req, res) => {
    try {
        await customermodel.createcustomer(req.body);
        res.status(201).json({ message: "Customer created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating customer" });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await customermodel.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching customers" });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await customermodel.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: "Error fetching customer" });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        await customermodel.updateCustomer(req.params.id, req.body);
        res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating customer" });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await customermodel.deleteCustomer(req.params.id);
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting customer" });
    }
};
