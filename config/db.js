import sql from "mssql";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = {
  user: process.env.USER,              // Username from .env
  password: process.env.PASSWORD,      // Password from .env
  server: process.env.SERVER.split(",")[0], // Server address from .env (without the port)
  port: parseInt(process.env.SERVER.split(",")[1]), // Extract port from .env
  database: process.env.DATABASE,      // Database name from .env
  options: {
    encrypt: true,                     // Use true for Azure or if required
    trustServerCertificate: true       // Disable SSL verification (use cautiously)
  }
};

let pool;

const connectToDB = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }
  return pool;
};

export default connectToDB;
