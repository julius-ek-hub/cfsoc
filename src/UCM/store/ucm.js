import { createSlice } from "@reduxjs/toolkit";

import { deepKey } from "../utils/utils";

const arr = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);

const ucSlice = createSlice({
  name: "ucm",
  initialState: {
    sheets: {},
    contents: {},
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
    setUCTable(state, { payload }) {
      state.contents = payload;
    },
  },
});

export const { updateSettings, addSheet, setUCTable } = ucSlice.actions;

export default ucSlice.reducer;
