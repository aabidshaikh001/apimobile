const connectToDB = require("../config/db");

const Services = {
  createTable: async () => {
    const db = await connectToDB();
    const sql = `
   IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='services' AND xtype='U')
BEGIN
  CREATE TABLE services (
    id INT PRIMARY KEY IDENTITY(1,1),
    serviceName NVARCHAR(100),
    serviceData NVARCHAR(MAX)
  )
END

    `;
    try {
      await db.request().query(sql);
      console.log("✅ Services table ensured");
    } catch (err) {
      console.error("❌ Error creating Services table:", err);
    }
    },
    getAll: async () => {
        const db = await connectToDB();
        const sql = "SELECT * FROM services";
        try {
            const result = await db.request().query(sql);
            return result.recordset.map(row => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceData: JSON.parse(row.serviceData),
            }));
        } catch (err) {
            console.error("❌ Error fetching Services:", err);
            throw err;
        }
        },
    create: async (serviceName, serviceData) => {
        const db = await connectToDB();
        const sql = "INSERT INTO services (serviceName, serviceData) VALUES (@serviceName, @serviceData)";
        try {
            await db.request()
                .input("serviceName", serviceName)
                .input("serviceData", JSON.stringify(serviceData))
                .query(sql);
        } catch (err) {
            console.error("❌ Error creating Service:", err);
            throw err;
        }
    }
};
module.exports = Services;

