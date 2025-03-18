import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  // Send OTP email
  async sendOTP(email, otp, purpose = "login") {
    try {
      const subject = purpose === "login" ? "Your Login Verification Code" : "Your Registration Verification Code"

      const text = `Your verification code is: ${otp}. This code will expire in 15 minutes.`

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
      `

      const info = await this.transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject,
        text,
        html,
      })

      console.log("Email sent:", info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }
}

export default new EmailService()

