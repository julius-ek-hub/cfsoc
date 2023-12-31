const { env } = require("../utils/common");

module.exports = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    if (env("NODE_ENV") === "developement") console.log(error);
    res.json({
      error: error.message,
      errorCode: 500,
      stack: error.stack,
    });
  }
};
