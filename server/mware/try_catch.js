const log = require("../logs");
const { env } = require("../utils/common");

const mail = require("../utils/mail");

module.exports = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    if (env("NODE_ENV") === "developement") console.log(error);
    else {
    }

    log(
      {
        message: error.message,
        status: error.code || "error",
        severity: "error",
      },
      req
    );

    res.json({
      error: error.message,
      errorCode: error.code || 500,
      stack: error.stack,
      complete: error,
    });
  }
};
