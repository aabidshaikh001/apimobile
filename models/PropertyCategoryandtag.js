const connectToDB = require("../config/db");
const sql = require("mssql");
const cache = require("../utils/cache");

const getAllPropertyCategories = async () => {
  const cacheKey = "propertyCategories";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData; // return from cache
  }

  try {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT REMCategoryCode, Name, REMPropStatusCode
      FROM REMMstPropCategory
    `);
    const data = result.recordset;

    cache.set(cacheKey, data, 0); // store with unlimited TTL
    return data;
  } catch (error) {
    console.error("Error fetching property categories:", error);
    throw error;
  }
};

const getAllPropertyTags = async () => {
  const cacheKey = "propertyTags";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData; // return from cache
  }

  try {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT REMPropTagCode, Name, REMPropStatusCode
      FROM REMMstPropTag
    `);
    const data = result.recordset;

    cache.set(cacheKey, data, 0); // store with unlimited TTL
    return data;
  } catch (error) {
    console.error("Error fetching property tags:", error);
    throw error;
  }
};

module.exports = {
  getAllPropertyCategories,
  getAllPropertyTags
};
