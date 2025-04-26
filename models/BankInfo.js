const connectToDB = require("../config/db");
const sql = require("mssql");

const BankInfo = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBBankInfo')
                BEGIN
                    CREATE TABLE MBBankInfo (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        name NVARCHAR(255),
                        logo NVARCHAR(255),
                        FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("BankInfo table created or already exists.");
        } catch (error) {
            console.error("Error creating BankInfo table:", error);
        }
    },

    insertBankInfo: async (bankInfo) => {
        try {
            const pool = await connectToDB();
            
            // Check if bank info already exists for this propertyId
            const checkQuery = "SELECT * FROM MBBankInfo WHERE propertyId = @propertyId";
            const existingRecord = await pool.request()
                .input("propertyId", sql.VarChar(50), bankInfo.propertyId)
                .query(checkQuery);

            if (existingRecord.recordset.length > 0) {
                // If the bank info already exists, return a message
                console.log("Bank info for this property already exists");
                return { message: "Bank info for this property already exists" };
            }
            
            // Insert new bank info if it does not exist
            const insertQuery = `
                INSERT INTO MBBankInfo (propertyId, name, logo)
                VALUES (@propertyId, @name, @logo)
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), bankInfo.propertyId)
                .input("name", sql.NVarChar(255), bankInfo.name)
                .input("logo", sql.NVarChar(255), bankInfo.logo)
                .query(insertQuery);
            
            console.log("Bank info inserted successfully.");
            return { message: "Bank info inserted successfully." };
        } catch (error) {
            console.error("Error inserting bank info:", error);
            return { message: "Error inserting bank info", error };
        }
    },

    getBankInfoByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBBankInfo WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching bank info:", error);
            return [];
        }
    },

    deleteBankInfoByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBBankInfo WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Bank info deleted successfully.");
        } catch (error) {
            console.error("Error deleting bank info:", error);
        }
    }
};

module.exports = BankInfo;
