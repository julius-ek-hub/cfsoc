import { createSlice } from "@reduxjs/toolkit";

import { deepKey, field_separator } from "../utils/utils";

const arr = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);

const mitreSlice = createSlice({
  name: "ucm",
  initialState: {
    sheets: {},
    settings: {},
  },
  reducers: {
    updateSettings(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.settings, true);
      object[lastKey] = payload.value;
    },

    updateTactics(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.tactics, true);
      object[lastKey] = payload.value;
      const _keys = payload.key.split(field_separator);
      state.changes.tactics[
        `${state.tactics[Number(_keys[0])].id}.${_keys.slice(1).join(".")}`
      ] = payload.value;
    },
    addTactics(state, { payload }) {
      state.tactics = arr(payload);
    },
    addSheet(state, { payload }) {
      arr(payload).map((sheet) => {
        if (state.sheets[sheet.key]) return;
        state.sheets[sheet.key] = sheet;
      });
    },
    deleteSheet(state, { payload }) {
      delete state.sheets[payload.key];
    },
    updateSheet(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.sheets, true);
      object[lastKey] = payload.value;
    },
  },
});

export const {
  addTactics,
  updateTactics,
  updateSettings,
  addSheet,
  updateSheet,
  deleteSheet,
} = mitreSlice.actions;

export default mitreSlice.reducer;
