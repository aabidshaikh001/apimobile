const connectToDB = require("../config/db");
const sql = require("mssql");
const HomeLoanModel = {
    create: async (homeLoanData) => {
        try {
            const { name, email, phone, loanType, message } = homeLoanData;
            if (!name || !email || !phone || !loanType || !message) {
                throw new Error("Missing required fields: name, email, phone, message are required.");
            }
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("name", sql.NVarChar, name)
                .input("email", sql.NVarChar, email)
                .input("phone", sql.NVarChar, phone)
                .input("loanType", sql.NVarChar, loanType)
                .input("message", sql.NVarChar(sql.MAX), message)
                .query(`
                    INSERT INTO homeLoan (name, email, phone, loanType, message)
                    VALUES (@name, @email, @phone, @loanType, @message);
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
                    CREATE TABLE homeLoan (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        name NVARCHAR(255) NOT NULL,
                        email NVARCHAR(255) NOT NULL,
                        phone NVARCHAR(255) NOT NULL,
                        loanType NVARCHAR(255) NOT NULL,
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
            const result = await pool.request().query("SELECT * FROM homeLoan");
            return result.recordset;
        } catch (err) {
            console.error("❌ Error fetching records:", err.message);
            return [];
        }
    }
};
module.exports = HomeLoanModel;