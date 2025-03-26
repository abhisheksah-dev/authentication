import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host:'smtp-relay.brevo.com',
  port:587,
  auth: {
    user: process.env.SMT_USER,
    pass: process.env.SMT_PASS
  }
  });

  export default transporter