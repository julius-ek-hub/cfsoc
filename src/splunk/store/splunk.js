import { createSlice } from "@reduxjs/toolkit";

const splunkSlice = createSlice({
  name: "splunk",
  initialState: { alerts: [], notify: [], alarm: true },
  reducers: {
    updateClient(state, { payload }) {
      state[payload.key] = payload.value;
    },
    updateAlert(state, { payload }) {
      const ind = state.alerts.findIndex((a) => a._id === payload._id);
      state.alerts[ind] = payload.value;
    },

    deleteAlert(state, { payload }) {
      const ind = state.alerts.findIndex((a) => a._id === payload._id);
      state.alerts.splice(ind, 1);
    },
    deleteNotify(state, { payload }) {
      const ind = state.notify.findIndex((a) => a.contact === payload.contact);
      state.notify.splice(ind, 1);
    },
    addAlert(state, { payload }) {
      (Array.isArray(payload) ? payload : [payload]).map((pl) => {
        !state.alerts.find((a) => a._id === pl._id) && state.alerts.push(pl);
      });
    },
    addNotify(state, { payload }) {
      (Array.isArray(payload) ? payload : [payload]).map((pl) => {
        !state.notify.find((n) => n.contact === pl.contact) &&
          state.notify.push(pl);
      });
    },
    updateNotify(state, { payload }) {
      state.notify.map((n) => {
        n.active = payload.includes(n.contact);
      });
    },
  },
});

export const {
  updateAlert,
  deleteAlert,
  deleteNotify,
  addAlert,
  addNotify,
  updateNotify,
  updateClient,
} = splunkSlice.actions;

export default splunkSlice.reducer;
