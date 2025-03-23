import connectToDB from "../config/db.js";
import sql from "mssql";

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
            const query = `
                INSERT INTO MBBankInfo (propertyId, name, logo)
                VALUES (@propertyId, @name, @logo)
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), bankInfo.propertyId)
                .input("name", sql.NVarChar(255), bankInfo.name)
                .input("logo", sql.NVarChar(255), bankInfo.logo)
                .query(query);
            console.log("Bank info inserted successfully.");
        } catch (error) {
            console.error("Error inserting bank info:", error);
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

export default BankInfo;
