const connectToDB = require("../config/db");
const sql = require("mssql");


const ExploreCitites = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ExploreCities')
                BEGIN
                    CREATE TABLE ExploreCities (
                       id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    properties INT DEFAULT 0,
    image_url NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("ExploreCities table created or already exists.");
        } catch (error) {
            console.error("Error creating ExploreCities table:", error);
        }
    },
    createExploreCity: async (city) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO ExploreCities (name, properties, image_url)
                VALUES (@name, @properties, @image_url);
            `;
            await pool.request()
                .input("name", sql.NVarChar(100), city.name)
                .input("properties", sql.Int, city.properties)
                .input("image_url", sql.NVarChar(255), city.image_url)
                .query(query);
            console.log("ExploreCity created successfully.");
        } catch (error) {
            console.error("Error creating ExploreCity:", error);
        }
    },
    getAllExploreCities: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM ExploreCities`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all ExploreCities:", error);
        }
    }};
   module.exports = ExploreCitites;