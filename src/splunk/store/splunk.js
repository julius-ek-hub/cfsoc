import { createSlice } from "@reduxjs/toolkit";

const splunkSlice = createSlice({
  name: "splunk",
  initialState: {
    alerts: [],
    account: {},
    show_splunk_info: true,
  },
  reducers: {
    setAccount(state, { payload }) {
      state.account = payload;
    },
    updateClient(state, { payload }) {
      state[payload.key] = payload.value;
    },
    updateAlert(state, { payload }) {
      payload._ids.map((_id) => {
        const ind = state.alerts.findIndex((a) => a._id === _id);
        Object.entries(payload.update).map(([k, v]) => {
          state.alerts[ind][k] = v;
        });
      });
    },
    addAlert(state, { payload }) {
      (Array.isArray(payload) ? payload : [payload]).map((pl) => {
        !state.alerts.find((a) => a._id === pl._id) && state.alerts.push(pl);
      });
      state.alerts.sort(
        (a, b) => new Date(b._time).getTime() - new Date(a._time).getTime()
      );
    },
  },
});

export const { updateAlert, addAlert, updateClient, setAccount } =
  splunkSlice.actions;

export default splunkSlice.reducer;
