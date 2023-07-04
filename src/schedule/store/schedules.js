import { createSlice } from "@reduxjs/toolkit";

const sort = (a, b) => new Date(b.to).getTime() - new Date(a.to).getTime();

const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: [],
    active: null,
    active_by: "sys",
    shifts: [],
    statuses: [],
    selected: [],
    history: [],
    historyLevel: 0,
  },
  reducers: {
    addSchedule(state, { payload }) {
      let sh = state.schedules;
      const { value, $new } = payload;
      if ($new) sh = value;
      else {
        (!Array.isArray(value) ? [value] : value).map((pl) => {
          if (sh.find((s) => s.to === pl.to && s.from === pl.from)) return;
          sh.push(pl);
        });
      }
      state.schedules = sh;
      state.schedules.sort(sort);
    },

    setActive(state, { payload }) {
      state.active = payload;
      state.history = [payload];
      state.historyLevel = 0;
    },
    setSelected(state, { payload }) {
      const pl = Array.isArray(payload) ? payload : [payload];
      pl.map((p) => {
        const { staff, dateIndex } = p;
        const exIndex = state.selected.findIndex(
          (s) => s.staff === staff && s.dateIndex === dateIndex
        );
        if (exIndex >= 0) state.selected.splice(exIndex, 1);
        else state.selected.push(p);
      });
    },
    addShift(state, { payload }) {
      const shifts = [...state.shifts];
      (!Array.isArray(payload) ? [payload] : payload).map((pl) => {
        if (shifts.find((s) => s.to === pl.to && s.from === pl.from)) return;
        shifts.push(pl);
      });
      state.shifts = shifts;
    },
    addStatus(state, { payload }) {
      const statuses = [...state.statuses];
      (!Array.isArray(payload) ? [payload] : payload).map((pl) => {
        const exists = statuses.find(
          (s) => s.name.toLowerCase() === pl.name.toLowerCase()
        );
        if (exists) return Object.entries(pl).map(([k, v]) => (exists[k] = v));
        statuses.push(pl);
      });
      state.statuses = statuses;
    },
    setActiveBy(state, { payload }) {
      const sug = state.active?.suggestions;
      if (sug && sug[payload]) state.active_by = payload;
      state.history = [];
      state.historyLevel = 0;
    },
    updateSuggestions(state, { payload }) {
      const pl = Array.isArray(payload) ? payload : [payload];
      pl.map((p) => {
        for (const key in p) {
          if (key === "shift") {
            const { assIndex, dateIndex, shift } = p[key];
            state.active.suggestions[state.active_by].assiduity[assIndex].dates
              .slice(dateIndex)
              .map((d) => {
                d.shift = shift;
              });
            continue;
          }

          const key_arr = key.split("@").map((k) => (isNaN(k) ? k : Number(k)));
          const without_last = key_arr.slice(0, key_arr.length - 1);
          const target = without_last.reduce(
            (prev, curr) => prev[curr],
            state.active
          );
          target[key_arr[key_arr.length - 1]] = p[key];
        }
      });
      state.history.push(state.active);
      state.historyLevel = state.history.length - 1;
    },
    setHistory(state, { payload }) {
      const newLevel = state.historyLevel + payload;
      const _new = state.history[newLevel];
      if (_new) {
        state.active = _new;
        state.historyLevel = newLevel;
      }
    },
    removeSuggestion(state, { payload }) {
      const sg = { ...state.active.suggestions };
      delete sg[payload];
      state.active.suggestions = sg;
      state.schedules = state.schedules.filter(
        (s) => !(s.from === state.active.from && s.to === state.active.to)
      );
      state.history = [];
      state.historyLevel = 0;
    },
    updateLike(state, { payload: { by, newVotes } }) {
      state.active.suggestions[by].votes = newVotes;
      state.history.push(state.active);
      state.historyLevel = state.history.length - 1;
    },
  },
});

export const {
  addSchedule,
  addShift,
  removeSuggestion,
  setActive,
  setActiveBy,
  updateLike,
  updateSuggestions,
  setSelected,
  setHistory,
  addStatus,
} = schedulesSlice.actions;

export default schedulesSlice.reducer;
