const fs = require("fs");
const path = require("path");
const exec = require("child_process").execSync;

(() => {
  const _path = (file) =>
    path.join(...__dirname.split(path.sep).reverse().slice(2).reverse(), file);
  const pk_json_file = _path("package.json");
  const pk_json = JSON.parse(fs.readFileSync(pk_json_file, "utf-8"));
  const _v = pk_json.version;
  const v = _v.split(".").map(Number);
  if (v[2] === 9) {
    v[2] = 0;
    v[1]++;
    if (v[1] > 9) {
      v[1] = 0;
      v[2] = 0;
      v[0]++;
    }
  } else v[2]++;

  pk_json.version = v.join(".");
  fs.writeFileSync(pk_json_file, JSON.stringify(pk_json));
  exec(
    `git add . && git commit -m "Version change from ${_v} to ${pk_json.version}" && git push && npm run build`
  );
})();
