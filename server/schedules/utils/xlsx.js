const exceljs = require("exceljs");
const {
  create_th,
  staffs_in_shift,
  numberToLetters,
  int_to_time,
  u,
  schedule_date_range_ui,
} = require("./common");
const { getSchedule } = require("../db/schedules");
const { getShifs } = require("../db/dates");

module.exports = async ({ from, to, by }) => {
  let bys;

  if (!by) bys = ["sys"];
  bys = Array.isArray(by) ? by : by.split("_");

  const sug = await getSchedule(from, to);
  const shifts = await getShifs();
  const wb = new exceljs.Workbook();
  const dr = schedule_date_range_ui(from, to);
  const date = `${dr[0]} - ${dr[1]}`;

  bys.map((b) => {
    b = b.trim();
    const assiduity = sug.suggestions[b].assiduity;

    const ths = create_th(assiduity);

    const ws = wb.addWorksheet(u(b === "sys" ? "SYSTEM" : b.split(".")[0]));

    let currentRow = 1;
    const middle = { vertical: "middle", horizontal: "center" };

    const r1 = [date, ...ths.map((th) => th[0])];
    const r2 = [date, ...ths.map((th) => th[1])];
    const maxColLetter = numberToLetters(r1.length - 1);
    ws.addRows([r1, r2]);
    ws.mergeCells("A1:A2");
    [1, 2].map((n) => {
      ws.getRow(n).alignment = middle;
      [...new Array(r1.length)].map((i, j) => {
        const cell = ws.getCell(`${numberToLetters(j)}:${n}`);
        cell.height = 25;
        cell.font = {
          color: { argb: "ffffffff" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ff808080" },
        };
      });

      ws.getCell(`A${n}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffc65911" },
      };
    });
    ws.getColumn(1).width = 20;
    currentRow += 2;

    shifts.map((shift) => {
      const ass = staffs_in_shift(shift, assiduity);

      if (ass.length === 0) return;

      ws.addRow([`${int_to_time(shift.from)} - ${int_to_time(shift.to)}`]);
      ws.mergeCells(`A${currentRow}:${maxColLetter + currentRow}`);

      ws.getRow(currentRow).height = 37;
      const cell = ws.getCell(`A${currentRow}`);
      cell.alignment = { ...middle, horizontal: "left" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ff305496" },
      };
      cell.font = {
        color: { argb: "ffffffff" },
      };
      currentRow++;
      ass.map(({ dates, staff }) => {
        ws.addRow([
          u(staff.split(".")[0]),
          ...dates.map((d) => {
            const not_shift_swap =
              d.shift.from === shift.from && d.shift.to === shift.to;
            if (not_shift_swap && d.status === "work") return "X";
            return "";
          }),
        ]);
        const r = ws.getRow(currentRow);
        dates.map((d, i) => {
          const swap = !(
            d.shift.from === shift.from && d.shift.to === shift.to
          );
          if (swap) {
            r.getCell(i + 2).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ffd9d9d9" },
            };
          }
          if (!swap && Object.values(d.comments).some((v) => v)) {
            let note = "";

            Object.keys(d.comments).map((s) => {
              const com = d.comments[s];
              if (com) {
                note += u(s.split(".")[0]) + "\n-------------------\n";
                note += com + "\n\n";
              }
            });
            r.getCell(i + 3).note = note;
          }
        });
        r.alignment = middle;
        r.height = 55;
        ws.getCell(`A:${currentRow}`).alignment = {
          ...middle,
          horizontal: "left",
        };
        currentRow += 1;
      });
    });

    ws.eachRow((r) =>
      r.eachCell({ includeEmpty: true }, (c) => {
        c.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      })
    );
  });

  return wb;
};
