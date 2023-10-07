const fs = require("fs");
const path = require("path");
const exec = require("child_process").execSync;

(() => {
  const pk_json_file = path.join(
    ...__dirname.split(path.sep).reverse().slice(2).reverse(),
    "package.json"
  );
  const pk_json = JSON.parse(fs.readFileSync(pk_json_file, "utf-8"));
  const v = pk_json.version.split(".").map(Number);
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
  exec(`git add .`);
  exec(`git commit -m "Updating to ${pk_json.version}"`);
  exec(`git push`);
  exec(`npm run build`);
})();
