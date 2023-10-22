import { createSlice } from "@reduxjs/toolkit";

import { deepKey, field_separator as fs } from "../utils/utils";

const arr = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);

const mitreSlice = createSlice({
  name: "expo_sentinel",
  initialState: {
    sheets: {},
    settings: {},
  },
  reducers: {
    updateSettings(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.settings, true);
      object[lastKey] = payload.value;
    },
    addSheet(state, { payload }) {
      arr(payload).map((sheet) => {
        if (state.sheets[sheet.key]) return;
        state.sheets[sheet.key] = sheet;
      });
    },

    replaceSheet(state, { payload }) {
      state.sheets = {};
      arr(payload).map((sheet) => {
        if (state.sheets[sheet.key]) return;
        state.sheets[sheet.key] = sheet;
      });
    },
    deleteSheet(state, { payload }) {
      delete state.sheets[payload.key];
    },
    updateSheet(state, { payload }) {
      const key = payload.key;
      // const _key = key.split(fs)[0];
      const { object, lastKey } = deepKey(key, state.sheets, true);
      object[lastKey] = payload.value;
    },
  },
});

export const {
  updateSettings,
  addSheet,
  updateSheet,
  deleteSheet,
  replaceSheet,
} = mitreSlice.actions;

export default mitreSlice.reducer;
