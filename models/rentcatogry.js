const connectToDB = require("../config/db");

const rentCategory = {
 

getAll: async () => {
  try {
    const pool = await connectToDB();

    const [categoryResult, tagResult] = await Promise.all([
      pool.request().query(`
        SELECT Name
        FROM REMMstPropCategory
        WHERE REMPropStatusCode = 'PS-0002' AND OrgCode = 1000 AND IsDeleted = 0
      `),
      pool.request().query(`
        SELECT Name
        FROM REMMstPropTag
        
        WHERE REMPropStatusCode = 'PS-0002' AND OrgCode = 1000 AND IsDeleted = 0
      `)
    ]);

    const categoryNames = categoryResult.recordset.map(item => item.Name);
    const tagNames = tagResult.recordset.map(item => item.Name);

    return {
      PropertyType: categoryNames,
      Status: tagNames
    };
  } catch (err) {
    console.error("❌ Error fetching category and tag names:", err);
    return {
      categoryItems: [],
      tagItems: []
    };
  }
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
