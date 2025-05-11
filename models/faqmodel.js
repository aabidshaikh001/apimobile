const connectToDB = require("../config/db");
const sql = require("mssql");

const Faqmodel = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMWEBTranFAQ')
                CREATE TABLE REMWEBTranFAQ (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    category NVARCHAR(255) NOT NULL,
                    question NVARCHAR(MAX) NOT NULL,
                    answer NVARCHAR(MAX) NOT NULL
                )
            `);
            console.log("✅ REMWEBTranFAQ table ensured.");
        } catch (error) {
            console.error("❌ Error creating REMWEBTranFAQ table:", error);
        }
    },

    // Bulk Insert method for structured faqData
    createBulk: async (faqData) => {
        try {
            const pool = await connectToDB();

            // Loop through each category and its items
            for (const categoryData of faqData) {
                const { category, items } = categoryData;
                
                // Insert each REMWEBTranFAQ item under its category
                for (const { question, answer } of items) {
                    await pool.request()
                        .input("category", sql.NVarChar(255), category)
                        .input("question", sql.NVarChar(sql.MAX), question)
                        .input("answer", sql.NVarChar(sql.MAX), answer)
                        .query(`
                            INSERT INTO REMWEBTranFAQ (category, question, answer)
                            VALUES (@category, @question, @answer)
                        `);
                    console.log(`✅ REMWEBTranFAQ entry added under ${category}`);
                }
            }

        } catch (error) {
            console.error("❌ Error creating REMWEBTranFAQ entries:", error);
        }
    },

    // Fetching and structuring the data back into faqData format
    getAll: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query("SELECT * FROM REMWEBTranFAQ");
            const faqs = result.recordset;

            // Grouping the FAQs by category
            const faqData = faqs.reduce((acc, { category, question, answer }) => {
                const existingCategory = acc.find(item => item.category === category);
                if (existingCategory) {
                    existingCategory.items.push({ question, answer });
                } else {
                    acc.push({
                        category,
                        items: [{ question, answer }]
                    });
                }
                return acc;
            }, []);

            return faqData;

        } catch (error) {
            console.error("❌ Error fetching all REMWEBTranFAQ entries:", error);
        }
    },

    delete: async (id) => {
        try {
            const pool = await connectToDB();
            await pool.request()
                .input("id", sql.Int, id)
                .query("DELETE FROM REMWEBTranFAQ WHERE id = @id");
            console.log("✅ REMWEBTranFAQ entry deleted.");
        } catch (error) {
            console.error("❌ Error deleting REMWEBTranFAQ entry:", error);
        }
    }
};

module.exports = Faqmodel;
