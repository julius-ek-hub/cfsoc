const {
  getSheets: gs,
  newSheet: ns,
  updateSheet: us,
  updateSheetLocation: usl,
  deleteSheet: ds,
  updateStructure: ustr,
} = require("../db/sheets");

const getSheets = async (req, res) => {
  const data = await gs({}, req.query.staff, req.query.by);
  res.json(data);
};

const newSheet = async (req, res) => {
  const $new = await ns(req.body, req.query.creator);
  res.json($new);
};

const updateSheet = async (req, res) => {
  const $new = await us(req.body, req.query);
  res.json($new);
};

const updateStructure = async (req, res) => {
  const $new = await ustr(req.body, req.query);
  res.json($new);
};
const updateSheetLocation = async (req, res) => {
  const $new = await usl(req.body);
  res.json($new);
};
const deleteSheet = async (req, res) => {
  const $update = await ds(req.params.key);
  res.json($update);
};

module.exports = {
  getSheets,
  newSheet,
  updateSheet,
  deleteSheet,
  updateSheetLocation,
  updateStructure,
};
