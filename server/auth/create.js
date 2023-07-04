const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { objectExcept, env } = require("../utils/common");
const { updateStaff } = require("./db");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, bcrypt.genSaltSync());
    const user = await updateStaff({ username }, { hash });
    const token = jwt.sign({ username }, env("JWT_KEY"));
    res.json({
      token,
      user: { ...objectExcept(user, ["hash", "_id", "__v"]), username },
    });
  } catch (error) {
    res.json({
      error: error.message,
      field: "p1",
    });
  }
};
