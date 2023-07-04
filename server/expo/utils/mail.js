const nodemailer = require("nodemailer");
const { env } = require("../../utils/common");
const { getNotify } = require("../db/notify");

const sendEmailNotifications = async (body) => {
  const notify = await getNotify({ type: "email", active: true });
  // console.log(notify.map((n) => n.contact));

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
      from: "Splunk " + env("EMAIL_ID"),
      to: "julius.ek.dev@gmail.com",
      text: body,
      subject: "Splunk Alert",
    });
};

module.exports = sendEmailNotifications;
