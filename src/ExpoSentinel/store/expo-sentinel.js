import { createSlice } from "@reduxjs/toolkit";

import {
  _entr,
  _values,
  deepKey,
  entr_,
  field_separator as fs,
} from "../utils/utils";

const arr = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);

const mitreSlice = createSlice({
  name: "expo_sentinel",
  initialState: {
    sheets: {},
    initial_state: {},
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
        state.initial_state[sheet.key] = {
          columns: entr_(_entr(sheet.columns).map(([k, v]) => [k, v.position])),
          location: sheet.location,
          excluded_columns: sheet.excluded_columns,
        };
      });
    },
    deleteSheet(state, { payload }) {
      delete state.sheets[payload.key];
    },
    updateSheet(state, { payload }) {
      const key = payload.key;
      const { object, lastKey } = deepKey(key, state.sheets, true);
      object[lastKey] = payload.value;
      // if (["content", "sn"].includes(lastKey)) {
      //   const nc = [];
      //   const oc = state.sheets[key.split(fs)[0]].content;
      //   [...new Array(oc.length)].map((i, j) => {
      //     const oc_ = oc[j];
      //     const oc_sn = oc.find()
      //     console.log(j, payload.value);
      //   });
      // }
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
