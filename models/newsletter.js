const connectToDB = require("../config/db");
const sql = require("mssql");

const Newsletter = {
// Create table if not exists
createTable: async () => {
    try {
        const pool = await connectToDB();
        await pool.request().query(`
            IF NOT EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Newsletter'
            )
            CREATE TABLE Newsletter (
             id INT PRIMARY KEY IDENTITY(1,1),
  email NVARCHAR(255) NOT NULL,
  subscribedAt DATETIME DEFAULT GETDATE()
            )
        `);
        console.log("✅ Newsletter table created or already exists.");
        }
    catch (error) {
        console.error("❌ Error creating Newsletter table:", error);
        }
    },
// Insert newsletter 
insertNewsletter: async (email) => {
    try {
        const pool = await connectToDB();
        await pool.request()
            .input("email", sql.NVarChar(255), email)
            .query("INSERT INTO Newsletter (email) VALUES (@email)");
        console.log("✅ Newsletter email inserted.");
        }
    catch (error) {
        console.error("❌ Error inserting newsletter email:", error);
        throw error;
        }
    },
// Get all newsletter emails
getAllEmails: async () => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM Newsletter");
        return result.recordset;
        }
    catch (error) {
        console.error("❌ Error fetching newsletter emails:", error);
        throw error;
        }
    },
};
module.exports = Newsletter;