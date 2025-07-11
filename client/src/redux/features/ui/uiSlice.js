import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loading: false,
    error: null,
    success: null,
    message: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearUIState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
});

export const { setLoading, setError, setSuccess, setMessage, clearUIState } =
  uiSlice.actions;
export default uiSlice.reducer;
