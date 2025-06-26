import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // No need to specify host/port
  auth: {
    user: process.env.SENDER_EMAIL,     // Your Gmail address
    pass: process.env.SENDER_PASSWORD,  // App password (not your actual Gmail password)
  },
});

export default transporter;
