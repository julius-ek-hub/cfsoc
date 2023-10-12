// const root = "C:\\Users\\WindowsHome\\Downloads\\sigma";
// const fs = require("fs");
// const path = require("path");
// const { getContent } = require("./ucm/db/content");
// const db = require("./mware/db");
// const { structure } = require("./ucm/utils");

// let uc = [];

// const readFile = (p, file) => {
//   if (!p.endsWith(".yml")) return;
//   const content = fs.readFileSync(p, { encoding: "utf-8" });

//   const lines = content.split("\n");

//   const _get = (key) =>
//     lines
//       .find((t) => t.split(key).length === 2 && t.indexOf(key) === 0)
//       ?.split(key)[1];

//   const title = _get("title: ") || "";
//   const status = _get("status: ") || "";
//   let description = _get("description: ") || "";
//   const tags = lines
//     .filter((line) => line.match(/( )+(- )attack./))
//     .map((l) => l.trim());

//   if (description === "|") {
//     const key = "description: ";
//     const dIndex = lines.findIndex(
//       (t) => t.split(key).length === 2 && t.indexOf(key) === 0
//     );

//     const sub = lines.slice(dIndex + 1);
//     const endIn = sub.findIndex((s) => s.split(/[a-z]+:/i).length === 2);

//     description = sub
//       .slice(0, endIn)
//       .map((s) => s.trim())
//       .join("\n");
//   }

//   const l2_uc_identifiers = [];
//   const l3_uc_identifiers = [];
//   const l4_uc_identifiers = [];

//   tags.map((tag) => {
//     const val = tag.split(/attack./)[1] || "";
//     if (val.match(/t[0-9]+/i)) {
//       if (val.split(".").length === 2)
//         l4_uc_identifiers.push(val.toUpperCase());
//       else l3_uc_identifiers.push(val.toUpperCase());
//     } else if (!val.match(/[0-9]/)) {
//       l2_uc_identifiers.push(val.toLowerCase().split("_").join("-"));
//     }
//   });

//   uc.push({
//     title,
//     status,
//     description,
//     l2_uc_identifiers,
//     l3_uc_identifiers,
//     l4_uc_identifiers,
//     url: `https://github.com/SigmaHQ/sigma/blob/master/rules/${file
//       .split(path.sep)
//       .join("/")}`,
//   });
// };

// const start = async () => {
//   const read = async (p) => {
//     const _p = path.join(root, p);
//     const ls = await fs.promises.lstat(_p);
//     if (ls.isFile()) return readFile(_p, p);
//     await Promise.all(
//       fs.readdirSync(_p).map((file) => read(path.join(p, file)))
//     );
//   };

//   await read("");
//   fs.writeFileSync("sigma.json", JSON.stringify(uc));
// };

// start();
