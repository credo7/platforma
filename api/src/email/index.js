import { sendMail } from "./nodemailer";
import { parse } from "node-html-parser";
import fs from "fs";

const { MAIL_CALLBACK, MAIL_ENABLED } = process.env;

export const getFile = (file) =>
  new Promise((resolve, reject) => {
    let data;
    fs.createReadStream(file)
      .on("data", (chunk) => {
        data = chunk.toString();
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", reject);
  });

export const sendEmailVerify = async ({ email, code }) => {
  try {
    const fileHtml = await getFile(`${__dirname}/template/emailVerify.html`);
    const html = fileHtml
      .replaceAll("${CODE}", code)
      .replaceAll("${CALLBACK}", MAIL_CALLBACK);

    const subject = parse(html).querySelector("title").text;
    const info =
      MAIL_ENABLED === "1" && (await sendMail({ to: email, subject, html }));

    return info;
  } catch (message_2) {
    return console.error(message_2);
  }
};
