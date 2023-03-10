import { createTransport } from "nodemailer";

const { MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT, MAIL_FROM, MAIL_SITE } =
  process.env;

export const transporter = createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_PORT == 465,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const sendMail = async ({ from, to, subject, html }) => {
  try {
    await transporter.verify();
    try {
      return await transporter.sendMail({
        from: from || MAIL_FROM,
        to: to || MAIL_FROM,
        subject: `[${MAIL_SITE}] ${subject || "No Subject"}`,
        html: html || "No HTML",
      });
    } catch (err) {
      return console.error(err);
    }
  } catch (err_1) {
    return console.error(err_1);
  }
};
