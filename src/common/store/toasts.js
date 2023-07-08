import { createSlice } from "@reduxjs/toolkit";

const overlaySlice = createSlice({
  name: "toasts",
  initialState: { toasts: [] },
  reducers: {
    shift(state) {
      state.toasts.shift();
    },
    push(state, { payload }) {
      state.toasts.push(payload);
    },
  },
});

export const { shift, push } = overlaySlice.actions;

export default overlaySlice.reducer;
