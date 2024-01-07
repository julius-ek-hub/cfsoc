const jwt = require("jsonwebtoken");
const { check } = require("../utils/update");

const {
  getStaff: gs,
  addStaff: as,
  updateStaff: us,
  deleteStaff: ds,
} = require("./db");
const { env } = require("../utils/common");

const getStaffs = async (req, res) => {
  const staffs = await gs();
  res.json(staffs);
};

const getUser = async (req, res) => {
  const app_versions = await check();
  const { token } = req.query;

  try {
    const { username } = jwt.verify(token, env("JWT_KEY"));
    const user = await gs({ username }, "-hash -__v");
    res.json({ ...user[username], app_versions });
  } catch (error) {
    res.json({
      name: "Default Acount",
      level: 0,
      admin: false,
      username: "default.account",
      position: "-",
      email: "",
      app_versions,
    });
  }
};
const addStaff = async (req, res) => {
  let { email, ...rest } = req.body;
  email = email.toLowerCase();
  const username = email.split("@")[0];
  const exist = await gs({ email });

  if (exist[username])
    return res.json({
      error: `Staff with this email exists.`,
      field: "email",
    });
  if (email.split("@")[1] !== "beaconred.ae")
    return res.json({
      error: `Invalid email, must be in the form <staff>@beaconred.ae`,
      field: "email",
    });
  const add = await as({ username, email, ...rest });
  res.json(add);
};

const updateStaff = async (req, res) => {
  const app_versions = await check();
  let { username, ...update } = req.body;
  const upd = await us({ username }, update);
  res.json({ ...upd, app_versions });
};

const deleteStaff = async (req, res) => {
  const username = req.query.username;
  const st = await gs({ username });
  const deleted = await ds(username);
  res.json({ ...deleted });
};

module.exports = { addStaff, getStaffs, updateStaff, deleteStaff, getUser };
