import { createSlice } from "@reduxjs/toolkit";

const commonSettingsSlice = createSlice({
  name: "common_settings",
  initialState: { theme: "light" },
  reducers: {
    update(state, { payload: { key, value } }) {
      state[key] = value;
    },
  },
});

export const { update } = commonSettingsSlice.actions;

export default commonSettingsSlice.reducer;
