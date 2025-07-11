import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading, setError, setSuccess, setMessage, clearUIState } from "../ui/uiSlice";

// Sign Up
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (formData, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    dispatch(clearUIState());
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      dispatch(setSuccess(true));
      dispatch(setMessage(data.message || "Signup successful"));
      return data;
    } catch (error) {
      dispatch(setError(true));
      dispatch(setMessage(error.message || "Something went wrong"));
      return thunkAPI.rejectWithValue(error.message);
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
