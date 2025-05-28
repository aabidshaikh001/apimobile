const connectToDB = require("../config/db");
const sql = require("mssql");

const AboutProperty = {
    // Create Table
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AboutProperty')
                BEGIN
                    CREATE TABLE AboutProperty (
                        id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        description NVARCHAR(MAX),
                        FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("AboutProperty table created or already exists.");
        } catch (error) {
            console.error("Error creating AboutProperty table:", error);
        }
    },

    // Insert AboutProperty
    insertAboutProperty: async (propertyId, description) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO AboutProperty (propertyId, description)
                VALUES (@propertyId, @description)
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .input("description", sql.NVarChar(sql.MAX), description)
                .query(query);
            console.log("AboutProperty inserted successfully.");
        } catch (error) {
            console.error("Error inserting AboutProperty:", error);
        }
    },

    // Get AboutProperty by Property ID
    getAboutPropertyByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM AboutProperty WHERE propertyId = @propertyId`;
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching AboutProperty:", error);
            return null;
        }
    },

    // Update AboutProperty
    updateAboutProperty: async (propertyId, description) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE AboutProperty
                SET description = @description
                WHERE propertyId = @propertyId
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .input("description", sql.NVarChar(sql.MAX), description)
                .query(query);
            console.log("AboutProperty updated successfully.");
        } catch (error) {
            console.error("Error updating AboutProperty:", error);
        }
    },

    // Delete AboutProperty
    deleteAboutProperty: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM AboutProperty WHERE propertyId = @propertyId`;
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("AboutProperty deleted successfully.");
        } catch (error) {
            console.error("Error deleting AboutProperty:", error);
        }
    }
};

module.exports = AboutProperty;

