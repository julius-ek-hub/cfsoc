const { env } = require("./common");

module.exports = async (body) => {
  const fd = new FormData();
  fd.append("email", JSON.stringify(body));
  const resp = await fetch("https:/www.247-dev.com/api/email/send", {
    method: "POST",
    body: fd,
    headers: {
      "x-auth-token": env("EMAIL_TOKEN"),
    },
  });
  return resp.json();
};
