const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { objectExcept, env } = require("../../utils/common");
const { getStaff } = require("../../db/staffs");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  const users = await getStaff({ username });
  let user = users[username];
  if (!user) return res.json({ error: "User not found", field: "username" });
  if (!user.hash)
    return res.json({
      field: "password",
      error:
        "Password has not been created for this user, click Reset to create one",
    });
  try {
    const p = await bcrypt.compare(password, user.hash);
    if (!p)
      return res.json({
        error: "Login Failed! Incorrect password.",
        field: "password",
      });
    return res.json({
      jwt: jwt.sign({ username }, env("JWT_KEY")),
      user: objectExcept(user, ["hash", "_id"]),
      username,
    });
  } catch (error) {
    return res.json({
      error: "Login Failed! Incorrect password.",
      field: "password",
    });
  }
};
