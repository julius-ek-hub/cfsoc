const { addContent } = require("../db/content");
const { prepare } = require("../utils/extract_utils");
const extract = require("../utils/extract");
const { updateSheet } = require("../db/sheets");
const { addContent: ac } = require("../db/special_extract");

module.exports = async (req, res) => {
  const { sheet, sheet_index = 0, columns, unique_key } = req.body;
  let columns_parsed = JSON.parse(columns);
  let new_sheet = Object.keys(columns_parsed).length === 0;
  let new_columns;

  const { error, type, worker } = await prepare(
    req.files.extract,
    sheet_index,
    sheet
  );

  if (error) return res.json({ error });

  if (new_sheet) {
    new_columns = Object.fromEntries(
      (worker.fields || worker.columns).map((label, position) => [
        label === "_id"
          ? "__id"
          : label
              .replace(/[ ,.&\+=-]/gi, "_")
              .replace(/[#%\(\)\/]/gi, "")
              .toLowerCase(),
        {
          position,
          label: label
            .split("_")
            .map((l) => (l ? l[0].toUpperCase() + l.substring(1) : ""))
            .join(" "),
        },
      ])
    );

    await updateSheet({ key: sheet, update: { columns: new_columns } });

    columns_parsed = Object.fromEntries(
      Object.entries(new_columns).map(([k, v]) => [k, v.label])
    );
  }

  const data = await extract({
    columns: columns_parsed,
    unique_key,
    type,
    worker,
    sheet,
  });

  if (data.error) return res.json(data);

  const added = await addContent(sheet, data.data, unique_key);

  res.json({
    length: added.data.length,
    warnings: [...added.warnings, ...data.warnings],
    ...(new_columns && { new_columns }),
  });
};
