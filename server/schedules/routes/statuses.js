const {
  getStatus: gs,
  saveStatus: ss,
  updateStatus: us,
} = require("../db/statuses");

const getStatuses = async (req, res) => res.json(await gs());
const saveStatus = async (req, res) => res.json(await ss(req.body));

const updateStatus = async (req, res) => {
  let { name, ...update } = req.body;
  const upd = await us({ name }, update);
  res.json(upd);
};

module.exports = { getStatuses, saveStatus, updateStatus };
