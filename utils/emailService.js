import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com", // Default to Gmail
      port: Number(process.env.EMAIL_PORT) || 587, // Use port 587 for TLS
      secure: process.env.EMAIL_SECURE === "true", // false for TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Bypass self-signed certificate issues
      },
    });

    // Verify SMTP connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("❌ SMTP Connection Error:", error);
      } else {
        console.log("✅ SMTP Connected Successfully!");
      }
    });
  }

  // Send OTP Email
  async sendOTP(email, otp, purpose = "login") {
    try {
      const subject =
        purpose === "login"
          ? "Your Login Verification Code"
          : "Your Registration Verification Code";

      const text = `Your verification code is: ${otp}. This code will expire in 15 minutes.`;

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

      const info = await this.transporter.sendMail({
        from: `"TREC" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`, // Use EMAIL_FROM or fallback to EMAIL_USER
        to: email,
        subject,
        text,
        html,
      });

      console.log("✅ Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
