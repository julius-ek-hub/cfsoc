const {
  getContent: gc,
  addContent: ac,
  editContent: ec,
  deleteContent: dc,
} = require("../db/content");

const getContent = async (req, res) => {
  const data = await gc(req.query.sheet);
  res.json(data);
};
const addContent = async (req, res) => {
  const data = await ac(req.query.sheet, req.body, req.query.unique_key);
  res.json(data);
};
const editContent = async (req, res) => {
  const data = await ec(req.query.sheet, req.body);
  res.json(data);
};
const deleteContent = async (req, res) => {
  const data = await dc(req.query);
  res.json(data);
};

module.exports = {
  getContent,
  addContent,
  editContent,
  deleteContent,
};
