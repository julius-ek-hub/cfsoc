export const create_th = (ass) => {
  return ass[0].dates.map(({ date }, i, arr) => {
    const d = new Date(date);
    let same_month = true;
    const m = d.getMonth();
    const dm = d.toDateString().split(" ");
    if (i == 0) same_month = false;
    else {
      same_month = m === new Date(arr[i - 1].date).getMonth();
    }
    return [dm[2] + (same_month ? "" : " - " + dm[1]), dm[0], date];
  });
};

const to_date_arr = (date) => new Date(date).toDateString().split(" ");

export const schedule_date_range_ui = (from, to) => {
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

export const schedule_date_range_ui_edit = (from, to) => {
  const f = to_date_arr(from);
  const t = to_date_arr(to);
  const n = to_date_arr(new Date());

  const same_year = f[3] === n[3] && t[3] === n[3];
  if (same_year) return [`${f[1]} ${f[2]}`, `${t[1]} ${t[2]}`];
  return [`${f[1]} ${f[2]} ${f[3]}`, `${t[1]} ${t[2]}, ${t[3]}`];
};

export const numberToLetters = (num) => {
  let letters = "";
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
};

export const int_to_time = (int) => {
  int = String(int).split(".").map(Number);
  let ampm = int[0] < 12 ? " AM" : " PM";
  let res = int[0] % 12;
  return (res === 0 ? 12 : res) + ":" + (int[1] ? int[1] * 6 : "00") + ampm;
};

export const next_or_current = (from, to, max_days = 15) => {
  const ft = new Date(from).getTime();
  const tt = new Date(to).getTime();
  const nt = new Date().getTime();

  let current = nt >= ft && nt <= tt;
  let next = ft > nt && tt > nt && ft - nt <= 1000 * 60 * 60 * 24 * max_days;

  return { current, next, editable: current || next };
};

export const staffs_in_shift = ({ from, to }, assiduity) => {
  return assiduity.filter(({ dates }) =>
    dates.find(({ shift: s }) => s.from === from && s.to === to)
  );
};

export const has_comments = (comments) => {
  return Object.values(comments).some((c) => c.length > 0);
};

export const cell_selected = (all, _this) => {
  return all.find(
    (s) => s.staff === _this.staff && s.dateIndex === _this.dateIndex
  );
};

export const accepted_schedule = (assiduity) => {
  const entries = Object.entries(assiduity);
  if (entries.length === 0) return null;
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
