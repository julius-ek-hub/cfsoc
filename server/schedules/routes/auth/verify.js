const jwt = require("jsonwebtoken");
const sendMail = require("../../utils/mail");
const { env } = require("../../utils/common");
const { getStaff } = require("../../db/staffs");

const verifyUser = async (req, res) => {
  const { username } = req.body;
  const users = await getStaff({ username });
  let user = users[username];
  if (!user) return res.json({ error: "User not found", field: "username" });
  try {
    const otp = Math.random().toString(36).toUpperCase().slice(2, 6);
    await sendMail({
      subject: "OTP - SOC Schedule",
      text: otp,
      to: user.email,
    });
    return res.json({ otp });
  } catch (error) {
    return res.json({
      error: error.message,
      field: "username",
    });
  }
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
