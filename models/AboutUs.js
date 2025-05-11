const connectToDB = require("../config/db");
const sql = require("mssql");

const AboutUs = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='REMWEBPageAbout' AND xtype='U')
                CREATE TABLE REMWEBPageAbout (
                    Id INT PRIMARY KEY IDENTITY(1,1),
                    CoreValues NVARCHAR(MAX),
                    WhyChooseUs NVARCHAR(MAX),
                    GrowthMetrics NVARCHAR(MAX),
                    OurStory NVARCHAR(MAX),
                    LastUpdated DATETIME DEFAULT GETDATE()
                )
            `;
            await pool.request().query(query);
            console.log("REMWEBPageAbout table created or already exists");
        } catch (error) {
            console.error("Error creating REMWEBPageAbout table:", error);
            throw error;
        }
    },

    getAboutUsData: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query(`
                SELECT TOP 1 CoreValues, WhyChooseUs, GrowthMetrics, OurStory 
                FROM REMWEBPageAbout 
                ORDER BY LastUpdated DESC
            `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error("Error fetching REMWEBPageAbout data:", error);
            throw error;
        }
    },

    addAboutUsData: async (data) => {
        try {
            const pool = await connectToDB();
            const result = await pool.request()
                .input("CoreValues", sql.NVarChar(sql.MAX), JSON.stringify(data.coreValues))
                .input("WhyChooseUs", sql.NVarChar(sql.MAX), JSON.stringify(data.whyChooseUs))
                .input("GrowthMetrics", sql.NVarChar(sql.MAX), JSON.stringify(data.growthMetrics))
                .input("OurStory", sql.NVarChar(sql.MAX), JSON.stringify(data.ourStory))
                .query(`
                    INSERT INTO REMWEBPageAbout (CoreValues, WhyChooseUs, GrowthMetrics, OurStory) 
                    VALUES (@CoreValues, @WhyChooseUs, @GrowthMetrics, @OurStory)
                `);
            return result;
        } catch (error) {
            console.error("Error inserting REMWEBPageAbout data:", error);
            throw error;
        }
    },
    
    updateAboutUsData: async (data) => {
        try {
            const pool = await connectToDB();
            const result = await pool.request()
                .input("CoreValues", sql.NVarChar(sql.MAX), data.CoreValues)
                .input("WhyChooseUs", sql.NVarChar(sql.MAX), data.WhyChooseUs)
                .input("GrowthMetrics", sql.NVarChar(sql.MAX), data.GrowthMetrics)
                .input("OurStory", sql.NVarChar(sql.MAX), data.OurStory)
                .query(`
                    UPDATE REMWEBPageAbout 
                    SET CoreValues = @CoreValues, 
                        WhyChooseUs = @WhyChooseUs, 
                        GrowthMetrics = @GrowthMetrics, 
                        OurStory = @OurStory,
                        LastUpdated = GETDATE()
                    WHERE Id = 1
                `);
            return result;
        } catch (error) {
            console.error("Error updating REMWEBPageAbout data:", error);
            throw error;
        }
    },
    deleteAboutUsData: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query(`
                DELETE FROM REMWEBPageAbout
            `);
            return result;
        } catch (error) {
            console.error("Error deleting REMWEBPageAbout data:", error);
            throw error;
        }
    }
};

module.exports = AboutUs;