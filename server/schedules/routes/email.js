const xlsx = require("../utils/xlsx");
const { schedule_date_range_ui } = require("../utils/common");
const mail = require("../utils/mail");

module.exports = async (req, res) => {
  const { subject, body, receipients, cc, from, to, bys, senderName, replyTo } =
    req.body;

  const dr = schedule_date_range_ui(from, to);
  const date = `${dr[0]} - ${dr[1]}`;
  const wb = await xlsx({ by: bys, from, to });

  const filename = `SOC Schedule ${date}.xlsx`;
  const content = await wb.xlsx.writeBuffer({
    filename,
  });

  await mail({
    subject,
    text: body,
    to: receipients,
    cc: cc.split(","),
    attachments: [
      {
        filename,
        content,
      },
    ],
    senderName,
    replyTo,
  });
  res.json({ message: "Email sent" });
};
