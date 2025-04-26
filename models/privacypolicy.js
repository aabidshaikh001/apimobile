const sql = require('mssql');
const connectToDB = require("../config/db");

const Privacypolicy = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Privacypolicy')
                BEGIN
                    CREATE TABLE Privacypolicy (
                        id INT PRIMARY KEY IDENTITY(1,1),
                        title NVARCHAR(255) NOT NULL,
                        content NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE(),
                        updatedAt DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Privacypolicy table created or already exists.");
        } catch (error) {   
            console.error("Error creating Privacypolicy table:", error);
        }
    },
    createPrivacypolicy: async (privacy) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO Privacypolicy (title, content)
                VALUES (@title, @content);
            `;
            await pool.request()
                .input("title", sql.NVarChar(255), privacy.title)
                .input("content", sql.NVarChar(sql.MAX), privacy.content)
                .query(query);
            console.log("Privacypolicy created successfully.");
        } catch (error) {
            console.error("Error creating Privacypolicy:", error);
        }
    },
    getAllPrivacypolicy: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM Privacypolicy`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all Privacypolicy:", error);
        }
    }};
    module.exports = Privacypolicy;