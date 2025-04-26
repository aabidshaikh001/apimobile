const connectToDB = require("../config/db");
const sql = require("mssql");

const ContactModel = { 
    createTable: async () => {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'contacts')
            BEGIN
                CREATE TABLE contacts (
                    id INT IDENTITY(1,1) PRIMARY KEY,
    fullName NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    personalNumber NVARCHAR(20) NOT NULL,
    whatsappNumber NVARCHAR(20),
    inquiryType NVARCHAR(50) NOT NULL,
    propertyType NVARCHAR(255) NOT NULL,
    propertyStatus NVARCHAR(255) NOT NULL,
    furnishing NVARCHAR(255) NOT NULL,
    availability NVARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
                );
            END
            `);
            console.log("📂 Table check complete.");
        } catch (err) {
            console.error("❌ Error creating table:", err.message);
        }
    },

    // Get All Contacts
    getAll: async () => {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM contacts");
        return result.recordset;
    },
    create: async (contactData) => {
        const { fullName, email, personalNumber, whatsappNumber, inquiryType, propertyType, propertyStatus, furnishing, availability, message } = contactData;
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input("fullName", sql.NVarChar, fullName)
            .input("email", sql.NVarChar, email)
            .input("personalNumber", sql.NVarChar, personalNumber)
            .input("whatsappNumber", sql.NVarChar, whatsappNumber)
            .input("inquiryType", sql.NVarChar, inquiryType)
            .input("propertyType", sql.NVarChar, propertyType)
            .input("propertyStatus", sql.NVarChar, propertyStatus)
            .input("furnishing", sql.NVarChar, furnishing)
            .input("availability", sql.NVarChar, availability)
            .input("message", sql.Text, message)
            .query(`
            INSERT INTO contacts (fullName, email, personalNumber, whatsappNumber, inquiryType, propertyType, propertyStatus, furnishing, availability, message)
            OUTPUT INSERTED.id
            VALUES (@fullName, @email, @personalNumber, @whatsappNumber, @inquiryType, @propertyType, @propertyStatus, @furnishing, @availability, @message)
        `);
        return result.recordset[0].id;
    }
};
 
module.exports = ContactModel;