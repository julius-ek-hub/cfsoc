const { deleteNotify } = require("../expo/db/notify");
const {
  getStaff: gs,
  addStaff: as,
  updateStaff: us,
  deleteStaff: ds,
} = require("./db");

const getStaffs = async (req, res) => {
  const staffs = await gs();
  res.json(staffs);
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
  let { username, ...update } = req.body;
  const upd = await us({ username }, update);
  res.json(upd);
};

const deleteStaff = async (req, res) => {
  const username = req.query.username;
  const st = await gs({ username });
  const email = Object.values(st)[0].email;
  const deleted = await ds(username);
  await deleteNotify(email);
  res.json({ ...deleted });
};

module.exports = { addStaff, getStaffs, updateStaff, deleteStaff };
