const connectToDB = require("../config/db");
const sql = require("mssql");

const LegalAssistanceModel = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RESLGLTranLeads')
                BEGIN
                    CREATE TABLE RESLGLTranLeads (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        fullName NVARCHAR(255) NOT NULL,
                        email NVARCHAR(255) NOT NULL,
                        phoneNumber NVARCHAR(20) NOT NULL,
                        whatsappNumber NVARCHAR(20) NULL,
                        legaltopic NVARCHAR(255) NOT NULL,
                        message NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE()
                    );
                END
            `);
            console.log("📂 Table check complete.");
        } catch (err) {
            console.error("❌ Error creating table:", err.message);
        }
    },

    // Get All RESLGLTranLeads
    getAll: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query("SELECT * FROM RESLGLTranLeads");
            return result.recordset;
        } catch (err) {
            console.error("❌ Error fetching records:", err.message);
            return [];
        }
    },

    // Create RESLGLTranLeads Record
    create: async (legalAssistanceData) => {
        try {
            const { fullName, email, phoneNumber, whatsappNumber, legaltopic, message } = legalAssistanceData;
    
            // Check for missing required fields
            if (!fullName || !email || !phoneNumber || !legaltopic || !message) {
                throw new Error("Missing required fields: fullName, email, phoneNumber, legaltopic, message are required.");
            }
    
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("fullName", sql.NVarChar, fullName)
                .input("email", sql.NVarChar, email)
                .input("phoneNumber", sql.NVarChar, phoneNumber)
                .input("whatsappNumber", sql.NVarChar, whatsappNumber || null)  // Allow NULL for optional field
                .input("legaltopic", sql.NVarChar, legaltopic)
                .input("message", sql.NVarChar(sql.MAX), message)  // Fix message type
                .query(`
                    INSERT INTO RESLGLTranLeads (fullName, email, phoneNumber, whatsappNumber, legaltopic, message)
                    OUTPUT INSERTED.id
                    VALUES (@fullName, @email, @phoneNumber, @whatsappNumber, @legaltopic, @message)
                `);
    
            return result.recordset[0].id;
        } catch (err) {
            console.error("❌ Database Insertion Error:", err.message);
            throw err; // Ensure the error is logged properly
        }
    }
    
};

module.exports = LegalAssistanceModel;
