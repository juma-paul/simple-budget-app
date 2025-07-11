import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import {
  setLoading,
  setError,
  setSuccess,
  setMessage,
  clearUIState,
} from "../ui/uiSlice";

// Sign Up
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (formData, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    dispatch(setLoading(true));
    dispatch(clearUIState());

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      dispatch(setSuccess(true));
      dispatch(setMessage(data.message));
      return;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setSuccess(false));
      return thunkAPI.rejectWithValue(null);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    logOut: (state) => {
      state.currentUser = null;
    },
  },
});

export const { logOut } = userSlice.actions;
export default userSlice.reducer;
