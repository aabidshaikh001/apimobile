const connectToDB = require("../config/db");
const sql = require("mssql");

const ExploreCities = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstStateCity')
                BEGIN
                    CREATE TABLE REMMstStateCity (
                        id INT PRIMARY KEY IDENTITY(1,1),
                        state NVARCHAR(50) NOT NULL,
                        city NVARCHAR(50) NOT NULL,
                        name NVARCHAR(100) NOT NULL,
                        properties INT NULL,
                        image_url NVARCHAR(255) NOT NULL,
                        created_at DATETIME DEFAULT GETDATE(),
                        updated_at DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("REMMstStateCity table created or already exists.");
        } catch (error) {
            console.error("Error creating REMMstStateCity table:", error);
        }
    },

    createExploreCity: async (city) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO REMMstStateCity (state, city, name, properties, image_url, created_at, updated_at)
                VALUES (@state, @city, @name, @properties, @image_url, GETDATE(), GETDATE());
            `;
            await pool.request()
                .input("state", sql.NVarChar(50), city.state)
                .input("city", sql.NVarChar(50), city.city)
                .input("name", sql.NVarChar(100), city.name)
                .input("properties", sql.Int, city.properties || 0)
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
            const query = `SELECT * FROM REMMstStateCity ORDER BY created_at DESC`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all REMMstStateCity:", error);
            return [];
        }
    },
    getAllStatesWithCities: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT state, city FROM REMMstStateCity
    `);

    const grouped = {};
    result.recordset.forEach(({ state, city }) => {
      if (!grouped[state]) {
        grouped[state] = [];
      }
      grouped[state].push(city);
    });

    return Object.entries(grouped).map(([state, cities]) => ({
      state,
      cities,
    }));
  },
};

module.exports = ExploreCities;
