const connectToDB = require("../config/db");
const sql = require("mssql");


const PaymentPlan = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstPropPayPlan')
                BEGIN
                    CREATE TABLE REMMstPropPayPlan (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        payment NVARCHAR(50),
                        milestone NVARCHAR(MAX),
                        FOREIGN KEY (propertyId) REFERENCES REMMstProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("PaymentPlan table created or already exists.");
        } catch (error) {
            console.error("Error creating PaymentPlan table:", error);
        }
    },

    insertPaymentPlan: async (paymentPlan) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO REMMstPropPayPlan (propertyId, payment, milestone)
                VALUES (@propertyId, @payment, @milestone);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), paymentPlan.propertyId)
                .input("payment", sql.NVarChar(50), paymentPlan.payment)
                .input("milestone", sql.NVarChar(sql.MAX), paymentPlan.milestone)
                .query(query);
            console.log("Payment plan inserted successfully.");
        } catch (error) {
            console.error("Error inserting payment plan:", error);
        }
    },

    getPaymentPlansByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM REMMstPropPayPlan WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching payment plans:", error);
            return [];
        }
    },

    deletePaymentPlanById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM REMMstPropPayPlan WHERE id = @id";
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("Payment plan deleted successfully.");
        } catch (error) {
            console.error("Error deleting payment plan:", error);
        }
    },

    deletePaymentPlansByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM REMMstPropPayPlan WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("All payment plans for property deleted successfully.");
        } catch (error) {
            console.error("Error deleting payment plans:", error);
        }
    }
};

module.exports = PaymentPlan;
