import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { loading: {} },
  reducers: {
    updateLoading(state, { payload }) {
      state.loading[payload.key] = payload.value;
    },
  },
});

export const { updateLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
