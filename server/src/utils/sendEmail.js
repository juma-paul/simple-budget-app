import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or 'SendGrid', 'Mailgun', etc
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("Email error", {
      to,
      subject: mailOptions.subject,
      error: error.message,
    });
  }
}
