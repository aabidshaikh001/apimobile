const connectToDB = require("../config/db");
const sql = require("mssql");
const HomeInteriorModel = {
    createtable: async () => {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RESHITranLeads')
                BEGIN
                    CREATE TABLE RESHITranLeads (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        name NVARCHAR(255) NOT NULL,
                        email NVARCHAR(255) NOT NULL,
                        phone NVARCHAR(255) NOT NULL,
                        service NVARCHAR(255) NOT NULL,
                        message NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE()
                    );
                END
            `);
            console.log("📂 Table check complete.");
        } catch (err) {
            console.error("❌ Error creating table:", err.message);
        }
    },
    getAll: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query("SELECT * FROM RESHITranLeads");
            return result.recordset;
        } catch (err) {
            console.error("❌ Error fetching records:", err.message);
            return [];
        }
    },
    create: async (homeInteriorData) => {
        try {
            const { name, email, phone, service, message } = homeInteriorData;
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
                    INSERT INTO RESHITranLeads (name, email, phone, service, message)
                    VALUES (@name, @email, @phone, @service, @message);
                `);
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error creating record:", err.message);
            return 0;
        }
    }
};
module.exports = HomeInteriorModel;