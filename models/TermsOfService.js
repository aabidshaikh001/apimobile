const sql = require('mssql');
const connectToDB = require("../config/db");

const TermsOfService = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TermsOfService')
                BEGIN
                    CREATE TABLE TermsOfService (
                        id INT PRIMARY KEY IDENTITY(1,1),
                        title NVARCHAR(255) NOT NULL,
                        content NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE(),
                        updatedAt DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("TermsOfService table created or already exists.");
        } catch (error) {
            console.error("Error creating TermsOfService table:", error);
        }
    },
    createTermsOfService: async (terms) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO TermsOfService (title, content)
                VALUES (@title, @content);
            `;
            await pool.request()
                .input("title", sql.NVarChar(255), terms.title)
                .input("content", sql.NVarChar(sql.MAX), terms.content)
                .query(query);
            console.log("TermsOfService created successfully.");
        } catch (error) {
            console.error("Error creating TermsOfService:", error);
        }
    },
    getAllTermsOfService: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM TermsOfService`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all TermsOfService:", error);
        }
    },
    getTermsOfServiceById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM TermsOfService WHERE id = @id`;
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching TermsOfService:", error);
        }
    },
    updateTermsOfService: async (id, terms) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE TermsOfService
                SET title = @title, content = @content, updatedAt = GETDATE()
                WHERE id = @id;
            `;
            await pool.request()
                .input("id", sql.Int, id)
                .input("title", sql.NVarChar(255), terms.title)
                .input("content", sql.NVarChar(sql.MAX), terms.content)
                .query(query);
            console.log("TermsOfService updated successfully.");
        } catch (error) {
            console.error("Error updating TermsOfService:", error);
        }
    },
    deleteTermsOfService: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM TermsOfService WHERE id = @id`;
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("TermsOfService deleted successfully.");
        } catch (error) {
            console.error("Error deleting TermsOfService:", error);
        }
    }
    
};
module.exports = TermsOfService;