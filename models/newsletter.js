const connectToDB = require("../config/db");
const sql = require("mssql");

const Newsletter = {
// Create table if not exists
createTable: async () => {
    try {
        const pool = await connectToDB();
        await pool.request().query(`
            IF NOT EXISTS (
              SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'COMMstNewsSubs'
            )
            CREATE TABLE COMMstNewsSubs (
              id INT PRIMARY KEY IDENTITY(1,1),
              email NVARCHAR(255) NOT NULL UNIQUE,  -- ✅ Added UNIQUE constraint
              subscribedAt DATETIME DEFAULT GETDATE()
            )
          `);
          
        console.log("✅ COMMstNewsSubs table created or already exists.");
        }
    catch (error) {
        console.error("❌ Error creating COMMstNewsSubs table:", error);
        }
    },
// Insert newsletter 
insertNewsletter: async (email) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("email", sql.NVarChar(255), email)
        .query("INSERT INTO COMMstNewsSubs (email) VALUES (@email)");
      console.log("✅ COMMstNewsSubs email inserted.");
    } catch (error) {
      if (error.number === 2627) { // SQL Server duplicate key error
        console.warn("⚠️ Email already subscribed.");
      } else {
        console.error("❌ Error inserting COMMstNewsSubs email:", error);
      }
      throw error;
    }
  },
  // Get all newsletter emails
getAllEmails: async () => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM COMMstNewsSubs");
        return result.recordset;
        }
    catch (error) {
        console.error("❌ Error fetching COMMstNewsSubs emails:", error);
        throw error;
        }
    },
};
module.exports = Newsletter;