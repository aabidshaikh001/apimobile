const connectToDB = require("../config/db");
const sql = require("mssql");
const HomeConstructionModel = {
    create: async (homeConstructionData) => {
        try {
            const { name, email, phone, service, message } = homeConstructionData;
            if (!name || !email || !phone || !service || !message) {
                throw new Error("Missing required fields: name, email, phone, service, message are required.");
            }
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("name", sql.NVarChar, name)
                .input("email", sql.NVarChar, email)
                .input("phone", sql.NVarChar, phone)
                .input("service", sql.NVarChar, service)
                .input("message", sql.NVarChar(sql.MAX), message)
                .query(`
                    INSERT INTO RESHCTranLeads (name, email, phone, service, message)
                    VALUES (@name, @email, @phone, @service, @message);
                `);
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error creating record:", err.message);
            return 0;
        }
    },
    createtable: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool
                .request()
                .query(`
                    CREATE TABLE RESHCTranLeads (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        name NVARCHAR(255) NOT NULL,
                        email NVARCHAR(255) NOT NULL,
                        phone NVARCHAR(255) NOT NULL,
                        service NVARCHAR(255) NOT NULL,
                        message NVARCHAR(MAX) NOT NULL
                    );
                `);
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error creating table:", err.message);
            return 0;
        }
    },
    getAll: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query("SELECT * FROM RESHCTranLeads");
            return result.recordset;
        } catch (err) {
            console.error("❌ Error fetching records:", err.message);
            return [];
        }
    }
};
module.exports = HomeConstructionModel