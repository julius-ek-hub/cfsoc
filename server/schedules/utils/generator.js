const DAY = 1000 * 60 * 60 * 24;

const consec_dates = (from, to) => {
  const from_t = new Date(from).getTime();
  const from_d = from_t / DAY;
  const to_d = new Date(to).getTime() / DAY;

  return [...new Array(to_d - from_d + 1)].map((i, d) =>
    new Date(from_t + d * DAY).toLocaleDateString("en-US")
  );
};

const random_status_5 = [
  ["off", "off", "work", "work", "work"],
  ["work", "work", "off", "off", "work"],
  ["work", "work", "work", "off", "off"],
  ["work", "work", "work", "work", "off"],
  ["work", "work", "work", "work", "work"],
  ["off", "work", "work", "work", "work"],
  ["work", "off", "off", "work", "work"],
];

const generateDateRange = ({ from, max_day = 15 }) => {
  const prev_d = new Date(from || new Date());
  const next_d = new Date(prev_d.getTime() + (max_day - 1) * DAY);

  return {
    from: prev_d.toLocaleDateString("en-US"),
    to: next_d.toLocaleDateString("en-US"),
  };
};

const generateAssiduity = async ({
  from,
  to,
  blank,
  staffs,
  shifts,
  previous_schedule,
}) => {
  const _staffs = Object.keys(staffs);

  let shiftIndex = 0;
  let pre_5 = _staffs.map((staff) => {
    let newShift = shifts[shiftIndex];
    shiftIndex = shiftIndex === shifts.length - 1 ? 0 : shiftIndex + 1;
    return {
      statuses:
        random_status_5[Math.floor(Math.random() * random_status_5.length)],
      staff,
      newShift,
    };
  });

  if (previous_schedule)
    pre_5 = previous_schedule.assiduity.map(({ dates, staff }) => {
      const ds = dates.reverse().slice(0, 5).reverse();
      const sh = ds[0].shift;
      const shIndex = shifts.findIndex(
        (s) => s.from === sh.from && s.to === sh.to
      );
      let newShift = shifts[shIndex + 1] || shifts[0];
      return {
        statuses: ds.map((d) => d.status),
        staff,
        newShift,
      };
    });

  _staffs.map((staff) => {
    if (!pre_5.some((p5) => p5.staff === staff))
      pre_5.push({
        ...pre_5[0],
        staff,
      });
  });

  const ds = consec_dates(from, to);

  return pre_5.map(({ staff }) => {
    const dates = [...ds].map((date) => {
      const staffIndex = pre_5.findIndex((s) => s.staff === staff);
      const statuses = pre_5[staffIndex].statuses;

      let status = "work";

      const l1 = statuses[statuses.length - 1];
      const l2 = statuses[statuses.length - 2];
      const l5 = statuses.slice(statuses.length - 5);
      if (l5.every((s) => s === "work") || (l1 === "off" && l2 === "work"))
        status = "off";
      else if (l1 === "off" && l2 === "off") status = "work";

      pre_5[staffIndex].statuses.push(status);

      if (blank) status = "off";

      return {
        date,
        shift: pre_5[staffIndex].newShift,
        status,
        comments: pre_5.reduce((p, n) => {
          p[n.staff] = "";
          return p;
        }, {}),
      };
    });
    return {
      staff,
      dates,
    };
  });
};

module.exports = {
  generateAssiduity,
  generateDateRange,
};
