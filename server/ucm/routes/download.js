const { excelBuffer } = require("../utils");

module.exports = async (req, res) => {
  const { payload, format } = req.body;
  if (format === "json") {
    const actual_data = Object.fromEntries(
      payload.map((pl) => [
        pl.sheet,
        pl.data.map((data) =>
          Object.fromEntries(
            Object.entries(pl.columns)
              .filter((c) => !pl.excluded_columns.includes(c[0]))
              .map((c) => [
                c[0],
                data[c[0]] && !isNaN(data[c[0]])
                  ? Number(data[c[0]])
                  : data[c[0]],
              ])
          )
        ),
      ])
    );
    const data_to_json = JSON.stringify(actual_data);
    const buffer = Buffer.from(data_to_json, "utf-8");
    return res.type("application/json").send(buffer);
  }
  const eBuffer = await excelBuffer(payload);
  res.type("application/vnd.ms-excel").send(eBuffer);
};
