const https = require("https");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = require("child_process").execSync;

const get_new_version = () =>
  new Promise((res, rej) => {
    https
      .get(
        {
          path: "/julius-ek-hub/cfsoc/main/package.json",
          port: 443,
          hostname: "raw.githubusercontent.com",
        },
        (resp) => {
          let data = "";

          resp.on("data", (chunk) => (data += chunk));

          resp.on("end", async () => {
            const new_pk_json = JSON.parse(data);
            res(new_pk_json.version);
          });
        }
      )
      .on("error", rej);
  });

const update = (req, res) => {
  const new_version = get_new_version();
  try {
    exec(`git pull --force`);
    exec("git add .");
    exec(`git commit -m "Updating UI to ${new_version}"`);
    exec("npm run build");
  } finally {
    setTimeout(() => res.json({}), 5000);
  }
};

const check = async () => {
  const new_version = await get_new_version();
  const old_pk_json_file = path.join(
    ...__dirname.split(path.sep).reverse().slice(2).reverse(),
    "package.json"
  );
  const old_pk_json = JSON.parse(fs.readFileSync(old_pk_json_file, "utf-8"));

  return old_pk_json.version !== new_version;
};

module.exports = { check, update };
