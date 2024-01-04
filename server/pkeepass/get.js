const { getDBs: gDBs, getGroupContent } = require("./utils");

const getDBContent = async (req, res) => {
  const content = await getGroupContent(req.body);

  res.json(content);
};

const getDBs = async (req, res) => {
  const dbs = await gDBs(req.query.uname);
  res.json(dbs.map((db) => ({ name: db, groups: [] })));
};

module.exports = {
  getDBContent,
  getDBs,
};
