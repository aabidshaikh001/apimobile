import BankInfo from "../models/BankInfo.js";

export const createBankInfo = async (req, res) => {
    try {
        const { propertyId, name, logo } = req.body;
        await BankInfo.insertBankInfo({ propertyId, name, logo });
        res.status(201).json({ message: "Bank info added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error inserting bank info", details: error.message });
    }
};

export const getBankInfoByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const bankInfo = await BankInfo.getBankInfoByPropertyId(propertyId);
        res.status(200).json(bankInfo);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bank info", details: error.message });
    }
};

export const deleteBankInfoByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await BankInfo.deleteBankInfoByPropertyId(propertyId);
        res.status(200).json({ message: "Bank info deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting bank info", details: error.message });
    }
};
