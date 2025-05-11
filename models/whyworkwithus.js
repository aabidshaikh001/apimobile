const connectToDB = require("../config/db");
const sql = require("mssql");

const WhyWorkwithus = {
// Create table if not exists
createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMWEBPageCarrer'
        )
        CREATE TABLE REMWEBPageCarrer (
          id INT PRIMARY KEY IDENTITY(1,1),
  heading NVARCHAR(255),
  description NVARCHAR(MAX),
  cards NVARCHAR(MAX) -- JSON string of WhyWorkCard[]
        )
      `);
        console.log("✅ REMWEBPageCarrer table created or already exists.");
    } catch (error) {
        console.error("❌ Error creating REMWEBPageCarrer table:", error);
        }
    }
    ,
// Get all records
getAll: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT * FROM REMWEBPageCarrer");
    return result.recordset;
},
// Insert or update record
addWhyWorkwithus: async (heading, description, cards) => {
    const pool = await connectToDB();
    const check = await pool.request().query("SELECT COUNT(*) AS count FROM REMWEBPageCarrer");
    if (check.recordset[0].count > 0) {
        await pool.request()
            .input("heading", sql.NVarChar(255), heading)
            .input("description", sql.NVarChar(sql.MAX), description)
            .input("cards", sql.NVarChar(sql.MAX), JSON.stringify(cards))
            .query("UPDATE REMWEBPageCarrer SET heading = @heading, description = @description, cards = @cards");
    } else {
        await pool.request()
            .input("heading", sql.NVarChar(255), heading)
            .input("description", sql.NVarChar(sql.MAX), description)
            .input("cards", sql.NVarChar(sql.MAX), JSON.stringify(cards))
            .query("INSERT INTO REMWEBPageCarrer (heading, description, cards) VALUES (@heading, @description, @cards)");
    }
},
}
module.exports = WhyWorkwithus;
