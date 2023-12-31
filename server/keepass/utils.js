const fs = require("fs");
const path = require("path");

const getDBs = () =>
  new Promise((res, rej) => {
    fs.readdir(path.join(__dirname, "db"), (err, files) => {
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
