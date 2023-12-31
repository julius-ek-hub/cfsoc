const fs = require("fs");
const path = require("path");

const getDBs = () =>
  new Promise((res, rej) => {
    const p = path.join(__dirname, "db");
    if (!fs.existsSync(p)) fs.mkdirSync(p);
    fs.readdir(p, (err, files) => {
      if (err) return rej({ error: err.message });
      const dbs = [];
      files.forEach((file) => {
        if (file.endsWith(".kdbx")) dbs.push(file);
      });
      res(dbs);
    });
  });

module.exports = {
  getDBs,
};
