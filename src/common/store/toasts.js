import { createSlice } from "@reduxjs/toolkit";

const overlaySlice = createSlice({
  name: "toasts",
  initialState: { toasts: [] },
  reducers: {
    shift(state) {
      state.toasts.shift();
    },
    push(state, { payload }) {
      (Array.isArray(payload) ? payload : [payload]).map((pl) =>
        state.toasts.push(pl)
      );
    },
  },
});

export const { shift, push } = overlaySlice.actions;

export default overlaySlice.reducer;
