const connectToDB = require("../config/db");
const sql = require("mssql");
const foragentModel = {
    initializeTable: async () => {
        try {
        const pool = await connectToDB();
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'foragent')
            BEGIN
            CREATE TABLE foragent (
                id INT IDENTITY(1,1) PRIMARY KEY,
                fullName NVARCHAR(255) NOT NULL,
                email NVARCHAR(255) NOT NULL UNIQUE,
                phone NVARCHAR(255) NOT NULL,
                licenseNumber NVARCHAR(255) NOT NULL,
              yearsExperience NVARCHAR(255) NOT NULL,
                brokerage NVARCHAR(255) NOT NULL,
                specialization NVARCHAR(255) NOT NULL,
                message NVARCHAR(MAX) NOT NULL
            )
             
            END
        `);
        console.log("✅ foragent table initialized.");
        } catch (error) {
        console.error("❌ Error initializing table:", error);
        }
    },
    getAllProfiles: async () => {
        try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM foragent");
        return result.recordset;
        } catch (error) {
        console.error("❌ Error fetching foragent:", error);
        throw error;
        }
    },
    getProfileById: async (id) => {
        try {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM foragent WHERE id = @id");
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
            .input("fullName", sql.NVarChar, profile.fullName)
            .input("email", sql.NVarChar, profile.email)
            .input("phone", sql.NVarChar, profile.phone)
            .input("licenseNumber", sql.NVarChar, profile.licenseNumber)
            .input("yearsExperience", sql.NVarChar, profile.yearsExperience) // Changed FROM INT to NVARCHAR
            .input("brokerage", sql.NVarChar, profile.brokerage)
            .input("specialization", sql.NVarChar, profile.specialization)

            .input("message", sql.NVarChar, profile.message)
            .query(`
            INSERT INTO foragent (fullName, email, phone, licenseNumber, yearsExperience, brokerage, specialization, message)
            VALUES (@fullName, @email, @phone, @licenseNumber, @yearsExperience, @brokerage, @specialization, @message)
        `);
        return result;
        } catch (error) {
        console.error("❌ Error creating profile:", error);
        throw error;
        }
    }
};
module.exports = foragentModel;