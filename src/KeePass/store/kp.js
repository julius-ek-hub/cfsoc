import { createSlice } from "@reduxjs/toolkit";

import { deepKey, arrMust } from "../../common/utils/utils";

const kpSlice = createSlice({
  name: "keepass",
  initialState: {
    dbs: [],
    settings: {},
  },
  reducers: {
    updateSettings(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.settings, true);
      object[lastKey] = payload.value;
    },
    updateDB(state, { payload }) {
      const { object, lastKey } = deepKey(payload.key, state.dbs, true);
      object[lastKey] = payload.value;
    },

    addDB(state, { payload }) {
      const $new = [];
      arrMust(payload).map((pl, index) => {
        $new.push({ ...pl, index });
      });
      state.dbs = $new;
    },
  },
});

export const { updateSettings, updateDB, addDB } = kpSlice.actions;

export default kpSlice.reducer;
