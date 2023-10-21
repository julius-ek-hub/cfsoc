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
    deleteSheet(state, { payload }) {
      delete state.sheets[payload.key];
    },
    updateSheet(state, { payload }) {
      const key = payload.key;
      const _key = key.split(fs)[0];
      const { object, lastKey } = deepKey(key, state.sheets, true);
      object[lastKey] = payload.value;
      if (["content", "place_after"].some((ew) => key.endsWith(ew))) {
        const content = state.sheets[_key].content;

        state.sheets[_key].content = content
          .map((c, i) => {
            const sn = c.sn?.value;
            return { ...c, sn: { value: sn || i } };
          })
          .sort((a, b) => a.sn.value - b.sn.value);
      }
    },
  },
});

export const { updateSettings, addSheet, updateSheet, deleteSheet } =
  mitreSlice.actions;

export default mitreSlice.reducer;
