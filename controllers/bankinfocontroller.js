const BankInfo = require("../models/BankInfo");

const bankInfoController = {
    // Insert bank info for a property
    insertBankInfo: async (req, res) => {
        try {
            const { propertyId, name, logo } = req.body;

            // Prepare the bankInfo object
            const bankInfo = {
                propertyId,
                name,
                logo
            };

            // Insert bank info using the model
            const result = await BankInfo.insertBankInfo(bankInfo);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in insertBankInfo:", error);
            res.status(500).json({ message: "Error inserting bank info", error });
        }
    },

    // Get bank info for a property
    getBankInfo: async (req, res) => {
        try {
            const { propertyId } = req.params;
            
            // Get the bank info from the model
            const bankInfo = await BankInfo.getBankInfoByPropertyId(propertyId);

            if (bankInfo.length === 0) {
                return res.status(404).json({ message: "No bank info found for this property" });
            }

            res.status(200).json(bankInfo);
        } catch (error) {
            console.error("Error in getBankInfo:", error);
            res.status(500).json({ message: "Error fetching bank info", error });
        }
    },

    // Delete bank info for a property
    deleteBankInfo: async (req, res) => {
        try {
            const { propertyId } = req.params;

            // Delete the bank info using the model
            await BankInfo.deleteBankInfoByPropertyId(propertyId);
            res.status(200).json({ message: "Bank info deleted successfully" });
        } catch (error) {
            console.error("Error in deleteBankInfo:", error);
            res.status(500).json({ message: "Error deleting bank info", error });
        }
    }
};

module.exports = bankInfoController;
