import sql from "mssql"
import connectToDB from "../config/db.js"
import crypto from "crypto"

class OTP {
  // Create OTP table if it doesn't exist
  static async createTable() {
    try {
      const pool = await connectToDB()

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='otps' AND xtype='U')
        CREATE TABLE otps (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          purpose VARCHAR(20) NOT NULL,
          expiresAt DATETIME NOT NULL,
          createdAt DATETIME DEFAULT GETDATE()
        )
      `)

      console.log("OTP table created successfully")
      return true
    } catch (error) {
      console.error("Error creating OTP table:", error)
      throw error
    }
  }

  // Generate a new OTP for a user
  static async generateOTP(email, purpose = "login") {
    try {
      const pool = await connectToDB()
      const id = this.generateUUID()

      // Generate a 6-digit OTP
      const otp = this.generateRandomOTP()

      // Set expiration time (15 minutes from now)
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 15)

      // Delete any existing OTPs for this email and purpose
      await pool
        .request()
        .input("email", sql.VarChar, email)
        .input("purpose", sql.VarChar, purpose)
        .query(`
          DELETE FROM otps 
          WHERE email = @email AND purpose = @purpose
        `)

      // Insert the new OTP
      await pool
        .request()
        .input("id", sql.VarChar, id)
        .input("email", sql.VarChar, email)
        .input("otp", sql.VarChar, otp)
        .input("purpose", sql.VarChar, purpose)
        .input("expiresAt", sql.DateTime, expiresAt)
        .query(`
          INSERT INTO otps (id, email, otp, purpose, expiresAt)
          VALUES (@id, @email, @otp, @purpose, @expiresAt)
        `)

      return { success: true, otp }
    } catch (error) {
      console.error("Error generating OTP:", error)
      throw error
    }
  }

  // Verify an OTP
  static async verifyOTP(email, otp, purpose = "login") {
    try {
      const pool = await connectToDB()

      // Get the OTP record
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .input("otp", sql.VarChar, otp)
        .input("purpose", sql.VarChar, purpose)
        .input("now", sql.DateTime, new Date())
        .query(`
          SELECT * FROM otps
          WHERE email = @email 
          AND otp = @otp 
          AND purpose = @purpose
          AND expiresAt > @now
        `)

      if (result.recordset.length === 0) {
        return { success: false, message: "Invalid or expired OTP" }
      }

      // Delete the used OTP
      await pool
        .request()
        .input("email", sql.VarChar, email)
        .input("otp", sql.VarChar, otp)
        .input("purpose", sql.VarChar, purpose)
        .query(`
          DELETE FROM otps
          WHERE email = @email 
          AND otp = @otp 
          AND purpose = @purpose
        `)

      return { success: true, message: "OTP verified successfully" }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      throw error
    }
  }

  // Generate a random 6-digit OTP
  static generateRandomOTP() {
    return crypto.randomInt(100000, 999999).toString()
  }

  // Helper method to generate UUID
  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

export default OTP

