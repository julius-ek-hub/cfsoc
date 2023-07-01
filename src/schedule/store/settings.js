import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "schedule_settings",
  initialState: {},
  reducers: {
    updateSettings(state, { payload }) {
      state[payload.key] = payload.value;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
