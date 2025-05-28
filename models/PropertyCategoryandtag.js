const connectToDB = require("../config/db");
const sql = require("mssql");

const getAllPropertyCategories = async () => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT REMCategoryCode, Name FROM REMMstPropCategory");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching property categories:", error);
    throw error;
  }
};
const getAllPropertyTags = async () => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT REMPropTagCode, Name FROM REMMstPropTag");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching property tags:", error);
    throw error;
  }
};

module.exports = {
  getAllPropertyCategories,
    getAllPropertyTags
};
