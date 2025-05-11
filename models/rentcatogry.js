const connectToDB = require("../config/db");

const rentCategory = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='REMMstPropCatRent' AND xtype='U')
        CREATE TABLE REMMstPropCatRent (
          id INT IDENTITY(1,1) PRIMARY KEY,
          heading NVARCHAR(255) NOT NULL,
          items NVARCHAR(MAX) NOT NULL
        )
      `);
      console.log("✅ REMMstPropCatRent table ensured");
    } catch (err) {
      console.error("❌ Error creating REMMstPropCatRent table:", err);
    }
  },

  getAll: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT * FROM REMMstPropCatRent");
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
      .query("INSERT INTO REMMstPropCatRent (heading, items) VALUES (@heading, @items)");
  },
};

module.exports = rentCategory;
