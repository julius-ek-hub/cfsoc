const jwt = require("jsonwebtoken");
const { env } = require("../utils/common");
const { getStaff } = require("./db");

const verifyUser = async (req, res) => {
  const { username } = req.query;
  const users = await getStaff({ username });
  let user = users[username];
  if (!user) return res.json({ error: "User not found", field: "username" });
  res.json(user);
};

const verifyToken = async (req, res) => {
  try {
    const { value } = req.query;
    const { username } = jwt.verify(value, env("JWT_KEY"));
    const user = await getStaff({ username }, "-_id -__v -hash");
    if (Object.keys(user).length === 0)
      return res.json({ error: "User not found" });
    res.json({ ...user[username] });
  } catch (error) {
    res.json({ error });
  }
};

module.exports = { verifyUser, verifyToken };
