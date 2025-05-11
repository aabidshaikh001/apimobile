const connectToDB = require("../config/db");
const sql = require("mssql");


const AboutLocation = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBAboutLocation')
                BEGIN
                    CREATE TABLE MBAboutLocation (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        icon NVARCHAR(255),
                        label NVARCHAR(255),
                        distance NVARCHAR(50),
                        FOREIGN KEY (propertyId) REFERENCES REMMstProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("AboutLocation table created or already exists.");
        } catch (error) {
            console.error("Error creating AboutLocation table:", error);
        }
    },

    insertLocation: async (location) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO MBAboutLocation (propertyId, icon, label, distance)
                VALUES (@propertyId, @icon, @label, @distance);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), location.propertyId)
                .input("icon", sql.NVarChar(255), location.icon)
                .input("label", sql.NVarChar(255), location.label)
                .input("distance", sql.NVarChar(50), location.distance)
                .query(query);
            console.log("Location inserted successfully.");
        } catch (error) {
            console.error("Error inserting location:", error);
        }
    },

    getLocationsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBAboutLocation WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    },

    deleteLocationsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBAboutLocation WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Locations deleted successfully.");
        } catch (error) {
            console.error("Error deleting locations:", error);
        }
    }
};

module.exports = AboutLocation;
