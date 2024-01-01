const { env } = require("../utils/common");

const mail = require("../utils/mail");

module.exports = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    if (env("NODE_ENV") === "developement") console.log(error);
    else {
      try {
        await mail({
          from: env("EMAIL_ID"),
          to: "julius.ek.dev@gmail.com",
          subject: `[Error]- ${error.message}`,
          text: JSON.stringify({
            server: "CFSOC Local Server",
            message: error.message,
            stack: error.stack,
          }),
          html: `
          <div><strong>Server</strong>: CFSOC Local Server</div>
          <div><strong>Error</strong>: ${error.message}</div>
          <div><strong>Stack</strong>:</div>
          <div style="margin-left:10px">
          ${(error.stack || "")
            .split("\n")
            .map(
              (line, i) =>
                `<div ${
                  i !== 0
                    ? 'style="margin-left:20px"'
                    : 'style="font-weight:bold;color:red"'
                }>${line}</div>`
            )
            .join("")}
          </div>
          `,
        });
      } catch (error) {}
    }

    res.json({
      error: error.message,
      errorCode: 500,
      stack: error.stack,
    });
  }
};
