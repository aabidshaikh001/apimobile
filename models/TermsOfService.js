const sql = require('mssql');
const connectToDB = require("../config/db");

const TermsOfService = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMWEBPageToS')
                BEGIN
                    CREATE TABLE REMWEBPageToS (
                        id INT PRIMARY KEY IDENTITY(1,1),
                        title NVARCHAR(255) NOT NULL,
                        content NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE(),
                        updatedAt DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("REMWEBPageToS table created or already exists.");
        } catch (error) {
            console.error("Error creating REMWEBPageToS table:", error);
        }
    },
    createTermsOfService: async (terms) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO REMWEBPageToS (title, content)
                VALUES (@title, @content);
            `;
            await pool.request()
                .input("title", sql.NVarChar(255), terms.title)
                .input("content", sql.NVarChar(sql.MAX), terms.content)
                .query(query);
            console.log("REMWEBPageToS created successfully.");
        } catch (error) {
            console.error("Error creating REMWEBPageToS:", error);
        }
    },
    getAllTermsOfService: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM REMWEBPageToS`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all REMWEBPageToS:", error);
        }
    },
    getTermsOfServiceById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM REMWEBPageToS WHERE id = @id`;
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching REMWEBPageToS:", error);
        }
    },
    updateTermsOfService: async (id, terms) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE REMWEBPageToS
                SET title = @title, content = @content, updatedAt = GETDATE()
                WHERE id = @id;
            `;
            await pool.request()
                .input("id", sql.Int, id)
                .input("title", sql.NVarChar(255), terms.title)
                .input("content", sql.NVarChar(sql.MAX), terms.content)
                .query(query);
            console.log("REMWEBPageToS updated successfully.");
        } catch (error) {
            console.error("Error updating REMWEBPageToS:", error);
        }
    },
    deleteTermsOfService: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM REMWEBPageToS WHERE id = @id`;
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("REMWEBPageToS deleted successfully.");
        } catch (error) {
            console.error("Error deleting REMWEBPageToS:", error);
        }
    }
    
};
module.exports = TermsOfService;