const objectExcept = (obj = {}, except) => {
  const _new = { ...obj };
  except = Array.isArray(except) ? except : [except];
  return Object.fromEntries(
    Object.entries(_new).filter(([k]) => !except.includes(k))
  );
};

const sort_schedule_dates = (dates) => {
  return dates.sort(
    (a, b) => new Date(b.to).getTime() - new Date(a.to).getTime()
  );
};

const next_or_current = (from, to, max_days = 15) => {
  const ft = new Date(from).getTime();
  const tt = new Date(to).getTime();
  const nt = new Date().getTime();

  let current = nt >= ft && nt <= tt;
  let next = ft > nt && tt > nt && ft - nt <= 1000 * 60 * 60 * 24 * max_days;

  return { current, next, editable: current || next };
};
const env = (key) => process.env[key];

const create_th = (ass) => {
  return ass[0].dates.map(({ date }, i, arr) => {
    const d = new Date(date);
    let same_month = true;
    const m = d.getMonth();
    const dm = d.toDateString().split(" ");
    if (i == 0) same_month = false;
    else {
      same_month = m === new Date(arr[i - 1].date).getMonth();
    }
    return [dm[2] + (same_month ? "" : " - " + dm[1]), dm[0], date].map((n) =>
      !isNaN(n) ? Number(n) : n
    );
  });
};

const to_date_arr = (date) => new Date(date).toDateString().split(" ");

const schedule_date_range_ui = (from, to) => {
  const f = to_date_arr(from);
  const t = to_date_arr(to);
  const n = to_date_arr(new Date());

  const same_year = f[3] === n[3] && t[3] === n[3];

  if (same_year) {
    return [`${f[1]} ${f[2]}`, `${t[1]} ${t[2]}, ${f[3]}`];
  } else {
    return [`${f[1]} ${f[2]}, ${f[3]}`, `${t[1]} ${t[2]}, ${t[3]}`];
  }
};

const schedule_date_range_ui_edit = (from, to) => {
  const f = to_date_arr(from);
  const t = to_date_arr(to);
  const n = to_date_arr(new Date());

  const same_year = f[3] === n[3] && t[3] === n[3];
  if (same_year) return [`${f[1]} ${f[2]}`, `${t[1]} ${t[2]}`];
  return [`${f[1]} ${f[2]} ${f[3]}`, `${t[1]} ${t[2]}, ${t[3]}`];
};

const is_first_schedule = (dates = [], schedule) => {
  const { from, to } = dates[0] || {};
  return from === schedule.from && to === schedule.to;
};

const numberToLetters = (num) => {
  let letters = "";
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
};

const int_to_time = (int) => {
  int = String(int).split(".").map(Number);
  let ampm = int[0] < 12 ? " AM" : " PM";
  let res = int[0] % 12;
  return (res === 0 ? 12 : res) + ":" + (int[1] ? int[1] * 6 : "00") + ampm;
};

const u = (str) => str[0].toUpperCase() + str.substring(1);

const staffs_in_shift = ({ from, to }, assiduity) => {
  return assiduity.filter(({ dates }) =>
    dates.find(({ shift: s }) => s.from === from && s.to === to)
  );
};

const has_comments = (comments) => {
  return Object.values(comments).some((c) => c.length > 0);
};

const cell_selected = (all, _this) => {
  return all.find(
    (s) => s.staff === _this.staff && s.dateIndex === _this.dateIndex
  );
};

const accepted_schedule = (assiduity) => {
  const entries = Object.entries(assiduity);
  const first = entries.find(([k, v]) => v.approved);
  if (first) return first[0];

  const max_vote = Math.max(...entries.map(([k, v]) => v.votes.length));

  const second = entries.filter(([k, v]) => v.votes.length === max_vote);

  if (second.length === 1) return second[0][0];

  const third = second.sort(
    ([ak, av], [bk, bv]) => bv.generated_on - av.generated_on
  );

  return third[0][0];
};

module.exports = {
  objectExcept,
  sort_schedule_dates,
  next_or_current,
  cell_selected,
  has_comments,
  u,
  accepted_schedule,
  staffs_in_shift,
  numberToLetters,
  int_to_time,
  is_first_schedule,
  schedule_date_range_ui,
  schedule_date_range_ui_edit,
  create_th,
  env,
};
