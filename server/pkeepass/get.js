const { getDBs: gDBs, getGroupContent, log } = require("./utils");

const getDBContent = async (req, res) => {
  const content = await getGroupContent(req.body);
  await log("Database content successfully fetched", req);
  res.json(content);
};

const getDBs = async (req, res) => {
  const dbs = await gDBs(req.query.uname);
  await log("Databases fetched successfully", req);
  res.json(dbs.map((db) => ({ name: db, groups: [] })));
};

module.exports = {
  getDBContent,
  getDBs,
};
