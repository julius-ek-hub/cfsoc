const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { objectExcept, env } = require("../utils/common");
const { updateStaff } = require("./db");
const { check } = require("../utils/update");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  try {
    const app_versions = await check();
    const hash = await bcrypt.hash(password, bcrypt.genSaltSync());
    const user = await updateStaff({ username }, { hash, reset: false });
    const token = jwt.sign({ username }, env("JWT_KEY"));
    res.json({
      token,
      user: {
        ...objectExcept(user, ["hash", "_id", "__v"]),
        username,
        app_versions,
      },
    });
  } catch (error) {
    res.json({
      error: error.message,
      field: "p1",
    });
  }
};
