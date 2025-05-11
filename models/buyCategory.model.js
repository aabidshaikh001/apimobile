const connectToDB = require("../config/db");

const buyCategory = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='REMMstPropCatBuy' AND xtype='U')
        CREATE TABLE REMMstPropCatBuy (
          id INT IDENTITY(1,1) PRIMARY KEY,
          heading NVARCHAR(255) NOT NULL,
          items NVARCHAR(MAX) NOT NULL
        )
      `);
      console.log("✅ REMMstPropCatBuy table ensured");
    } catch (err) {
      console.error("❌ Error creating REMMstPropCatBuy table:", err);
    }
  },

  getAll: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT * FROM REMMstPropCatBuy");
    return result.recordset.map(row => ({
      id: row.id,
      heading: row.heading,
      items: JSON.parse(row.items),
    }));
  },

  create: async (heading, items) => {
    const pool = await connectToDB();
    await pool
      .request()
      .input("heading", heading)
      .input("items", JSON.stringify(items))
      .query("INSERT INTO REMMstPropCatBuy (heading, items) VALUES (@heading, @items)");
  },
};

module.exports = buyCategory;
