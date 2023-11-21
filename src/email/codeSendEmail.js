import nodemailer from "nodemailer";
import { codeEmailTemplete } from "./codeEmailTemplete.js";

export default async function codeSendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "emangomaa149@gmail.com",
      pass: "gaxy acml yhxm oufx",
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <process.env.EMAIL_SENDER>',
    to: options.email,
    subject: "Hello ✔",
    text: "first",
    html: codeEmailTemplete(options),
  });

  console.log("Message sent: %s", info);
}
