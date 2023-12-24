import * as nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  subject: string,
  massage: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html: massage,
  };

  await transporter.sendMail(mailOptions);
}
