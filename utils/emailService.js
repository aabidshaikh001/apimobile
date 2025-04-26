const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP Connected Successfully!");
    } catch (error) {
      console.error("❌ SMTP Connection Error:", error);
      throw new Error("Failed to connect to SMTP server");
    }
  }

  async sendOTP(email, otp, purpose = "login") {
    try {
      // Validate inputs
      if (!email || !otp) {
        throw new Error("Email and OTP are required");
      }

      const subject = purpose === "login" 
        ? "Your Login Verification Code" 
        : "Complete Your Registration - Verification Code";

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="font-size: 16px; color: #555;">Thank you for using our service.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h1 style="font-size: 32px; margin: 0; color: #333;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #777;">This code will expire in 15 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
        </div>
      `;

      const mailOptions = {
        from: `"TREC" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
        text: `Your verification code is: ${otp}. This code will expire in 15 minutes.`,
      };

     // Send email with timeout
const info = await Promise.race([
  this.transporter.sendMail(mailOptions),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Email sending timeout")), 10000)
  )
]);

      

      console.log("✅ Email sent successfully to:", email, "Message ID:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email to:", email, "Error:", error.message);
      return { 
        success: false, 
        error: error.message,
        details: error 
      };
    }
  }
}

module.exports = new EmailService();