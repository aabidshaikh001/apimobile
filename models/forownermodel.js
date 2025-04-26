const connectToDB = require("../config/db");
const sql = require("mssql");
const forownerModel = {
    initializeTable: async () => {
        try {
        const pool = await connectToDB();
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'forowner')
            BEGIN
            CREATE TABLE forowner (
                id INT IDENTITY(1,1) PRIMARY KEY,
               name NVARCHAR(255) NOT NULL,
               email NVARCHAR(255) NOT NULL UNIQUE,
               phone NVARCHAR(255) NOT NULL,
               propertyType NVARCHAR(255) NOT NULL,
               propertyLocation NVARCHAR(255) NOT NULL,
               expectedPrice NVARCHAR(255) NOT NULL,
                message NVARCHAR(MAX) NOT NULL
            )
             
            END
        `);
        console.log("✅ forowner table initialized.");
        } catch (error) {
        console.error("❌ Error initializing table:", error);
        }
    },
    getAllProfiles: async () => {
        try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM forowner");
        return result.recordset;
        } catch (error) {
        console.error("❌ Error fetching forowner:", error);
        throw error;
        }
    },
    getProfileById: async (id) => {
        try {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM forowner WHERE id = @id");
        return result.recordset[0];
        } catch (error) {
        console.error("❌ Error fetching profile:", error);
        throw error;
        }
    },
    createProfile: async (profile) => {
        try {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input("name", sql.NVarChar, profile.name)
            .input("email", sql.NVarChar, profile.email)
            .input("phone", sql.NVarChar, profile.phone)
            .input("propertyType", sql.NVarChar, profile.propertyType)
            .input("propertyLocation", sql.NVarChar, profile.propertyLocation)
            .input("expectedPrice", sql.NVarChar, profile.expectedPrice)
            .input("message", sql.NVarChar, profile.message)
            .query(`
            INSERT INTO forowner (name, email, phone, propertyType, propertyLocation, expectedPrice, message)
            VALUES (@name, @email, @phone, @propertyType, @propertyLocation, @expectedPrice, @message)
            `);
        return result;
        } catch (error) {
        console.error("❌ Error creating profile:", error);
        throw error;
        }
    }
};
module.exports = forownerModel;

            