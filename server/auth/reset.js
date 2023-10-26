const bcrypt = require("bcrypt");
const { updateStaff } = require("./db");

module.exports = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, bcrypt.genSaltSync());
    const user = await updateStaff({ username }, { hash, reset: true });
    res.json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
};
