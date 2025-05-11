const connectToDB = require("../config/db");
const sql = require("mssql");

const Quries = {
    // Create Table
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CSMTranBrokerQuery')
                BEGIN
                    CREATE TABLE CSMTranBrokerQuery (
                        id INT PRIMARY KEY IDENTITY(1,1),
      subject NVARCHAR(255) NOT NULL,
      details NVARCHAR(MAX) NOT NULL,
      phone NVARCHAR(50) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      category NVARCHAR(255) NOT NULL,
      createdAt DATETIME DEFAULT GETDATE(),
      updatedAt DATETIME DEFAULT GETDATE(),
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("CSMTranBrokerQuery table created or already exists.");
        } catch (error) {
            console.error("Error creating CSMTranBrokerQuery table:", error);
        }
    },
    // Insert Quries
    insertQuries: async (subject, details, phone, email, category) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO CSMTranBrokerQuery (subject, details, phone, email, category)
                VALUES (@subject, @details, @phone, @email, @category)
            `;
            await pool.request()
                .input("subject", sql.NVarChar(255), subject)
                .input("details", sql.NVarChar(sql.MAX), details)
                .input("phone", sql.NVarChar(50), phone)
                .input("email", sql.NVarChar(255), email)
                .input("category", sql.NVarChar(255), category)
                .query(query);
            console.log("CSMTranBrokerQuery inserted successfully.");
        } catch (error) {
            console.error("Error inserting CSMTranBrokerQuery:", error);
        }
    },
    // Get Quries by ID
    getQuriesById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM CSMTranBrokerQuery WHERE id = @id`;
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching CSMTranBrokerQuery:", error);
            return null;
        }
    },
    // Update Quries
    updateQuries: async (id, subject, details, phone, email, category) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE CSMTranBrokerQuery
                SET subject = @subject,
                    details = @details,
                    phone = @phone,
                    email = @email,
                    category = @category,
                    updatedAt = GETDATE()
                WHERE id = @id
            `;
            await pool.request()
                .input("id", sql.Int, id)
                .input("subject", sql.NVarChar(255), subject)
                .input("details", sql.NVarChar(sql.MAX), details)
                .input("phone", sql.NVarChar(50), phone)
                .input("email", sql.NVarChar(255), email)
                .input("category", sql.NVarChar(255), category)
                .query(query);
            console.log("CSMTranBrokerQuery updated successfully.");
        } catch (error) {
            console.error("Error updating CSMTranBrokerQuery:", error);
        }
    },
    // Delete Quries
    deleteQuries: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM CSMTranBrokerQuery WHERE id = @id`;
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("CSMTranBrokerQuery deleted successfully.");
        } catch (error) {
            console.error("Error deleting CSMTranBrokerQuery:", error);
        }
    },
    // Get all Quries
    getAllQuries: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM CSMTranBrokerQuery`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all CSMTranBrokerQuery:", error);
            return [];
        }
    }
};
module.exports = Quries;