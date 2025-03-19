import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Test App" <${process.env.EMAIL_FROM}>`,
      to: "aabidsaudia@gmail.com",
      subject: "Test Email",
      text: "This is a test email",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

testEmail();
