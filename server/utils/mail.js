const nodemailer = require("nodemailer");
const { env } = require("./common");

module.exports = ({
  subject,
  text,
  to = [],
  cc = [],
  attachments,
  replyTo,
  senderName: sn,
}) => {
  return nodemailer
    .createTransport({
      pool: true,
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: env("EMAIL_ID"),
        pass: env("EMAIL_PASS"),
      },
    })
    .sendMail({
      from: (sn ? sn + " " : "") + env("EMAIL_ID"),
      to: "julius.ek.dev@gmail.com",
      // to: env("NODE_ENV") === "developement" ? env("DEV_RECEIVE") : to,
      text,
      subject,
      replyTo,
      cc,
      attachments,
    });
};
