const {
  addContent: ac,
  editContent: ec,
  deleteContent: dc,
  getFilters: gf,
  getUCTable: gut,
  addFilter: af,
  removeFilter: rf,
} = require("../db/content");

const getUCTable = async (req, res) => {
  const { uc_filter } = req.query;
  const ucf = uc_filter ? JSON.parse(uc_filter) : [];

  let data = await gut(ucf);
  res.json(data);
};

const getFilters = async (req, res) => {
  const data = await gf();
  res.json(data);
};
const addFilter = async (req, res) => {
  const data = await af(req.body);
  res.json(data);
};
const removeFilter = async (req, res) => {
  const data = await rf(req.query);
  res.json(data);
};
const addContent = async (req, res) => {
  const data = await ac(req.body);
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
  getUCTable,
  addContent,
  editContent,
  deleteContent,
  getFilters,
  addFilter,
  removeFilter,
};
