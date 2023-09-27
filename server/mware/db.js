const mongoose = require("mongoose");
const { env } = require("../utils/common");

module.exports = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) return next();
    await mongoose.connect(
      env("NODE_ENV") === "developement"
        ? env("MONGO_DB_CONNECTION_STRING_DEV")
        : env("MONGO_DB_CONNECTION_STRING")
    );
    next();
    // console.log("connected");
  } catch (error) {
    res.json({ error: error.message, errorCode: 500, stack: error.stack });
  }
};
