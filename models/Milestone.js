const connectToDB = require("../config/db");
const sql = require("mssql");


const Milestone = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CSMMstBrokerMilestone')
                BEGIN
                    CREATE TABLE CSMMstBrokerMilestone (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        name NVARCHAR(255),
                        condition NVARCHAR(50),
                        brokerage NVARCHAR(50),
                        FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Milestone table created or already exists.");
        } catch (error) {
            console.error("Error creating Milestone table:", error);
        }
    },

    insertMilestone: async (milestone) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO CSMMstBrokerMilestone (propertyId, name, condition, brokerage)
                VALUES (@propertyId, @name, @condition, @brokerage);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), milestone.propertyId)
                .input("name", sql.NVarChar(255), milestone.name)
                .input("condition", sql.NVarChar(50), milestone.condition)
                .input("brokerage", sql.NVarChar(50), milestone.brokerage)
                .query(query);
            console.log("Milestone inserted successfully.");
        } catch (error) {
            console.error("Error inserting milestone:", error);
        }
    },

    getMilestonesByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM CSMMstBrokerMilestone WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching milestones:", error);
            return [];
        }
    },

    deleteMilestoneById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM CSMMstBrokerMilestone WHERE id = @id";
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("Milestone deleted successfully.");
        } catch (error) {
            console.error("Error deleting milestone:", error);
        }
    },

    deleteMilestonesByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM CSMMstBrokerMilestone WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("All milestones for property deleted successfully.");
        } catch (error) {
            console.error("Error deleting milestones:", error);
        }
    }
};

module.exports = Milestone;
