const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) return next();
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    next();
  } catch (error) {
    res.json({ error: error.message, errorCode: 500, stack: error.stack });
  }
};
