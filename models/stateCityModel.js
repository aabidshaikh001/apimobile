const connectToDB = require("../config/db");

const StateCity = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='StateCity' AND xtype='U')
        CREATE TABLE StateCity (
          id INT PRIMARY KEY IDENTITY(1,1),
          state NVARCHAR(255) NOT NULL,
          city NVARCHAR(255) NOT NULL
        )
      `);
      console.log("✅ StateCity table created or already exists.");
    } catch (err) {
      console.error("❌ Error creating StateCity table:", err);
    }
  },

  insertStateWithCities: async (stateName, cities) => {
    const pool = await connectToDB();
    const transaction = pool.transaction();
  
    try {
      await transaction.begin();
  
      for (const city of cities) {
        const request = transaction.request(); // 🔥 New request in each iteration
        await request
          .input("state", stateName)
          .input("city", city)
          .query(`INSERT INTO StateCity (state, city) VALUES (@state, @city)`);
      }
  
      await transaction.commit();
      return { state: stateName, cities };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
  ,

  getAllStatesWithCities: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT state, city FROM StateCity
    `);

    const grouped = {};
    result.recordset.forEach(({ state, city }) => {
      if (!grouped[state]) {
        grouped[state] = [];
      }
      grouped[state].push(city);
    });

    return Object.entries(grouped).map(([state, cities]) => ({
      state,
      cities,
    }));
  },
};

module.exports = StateCity;
