import nodemailer from "nodemailer";
import config from "../../../config";
const emailSender = async (email: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"PH-health-Care <ahosanul81@gmail.com>',
    to: email,
    subject: "Reset Password",
    text: "Hello world?", // plain‑text body
    html: html, // HTML body
  });
  console.log("message ", info.messageId);
};

export default emailSender;
