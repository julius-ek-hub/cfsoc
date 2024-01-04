import { createSlice } from "@reduxjs/toolkit";

import { deepKey, arrMust } from "../../common/utils/utils";

const pkpSlice = createSlice({
  name: "pkeepass",
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

export const { updateSettings, updateDB, addDB } = pkpSlice.actions;

export default pkpSlice.reducer;
