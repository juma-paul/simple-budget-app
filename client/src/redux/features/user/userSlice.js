import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// Log In
export const logInUser = createAsyncThunk(
  "user/logInUser",
  async (formData, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;

    dispatch(clearUIState());
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      dispatch(setSuccess(true));
      dispatch(setMessage(data.message || `Login successful`));

      return data;
    } catch (error) {
      dispatch(setError(true));
      dispatch(setMessage(error.message || "Something went wrong!"));

      return thunkAPI.rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Log out (API call, credentials needed)
export const logOutUser = createAsyncThunk(
  "user/logOutUser",
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;

    dispatch(clearUIState());
    dispatch(setLoading(true));

    try {
      const res = await fatch("api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }

      dispatch(setSuccess(true));
      dispatch(setMessage(data.message || "Logout successful"));

      return data;
    } catch (error) {
      dispatch(setError(true));
      dispatch(setMessage(error.message || "Something went wrong!"));

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
    signupSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.signupSuccess = true;
    });

    builder.addCase(signUpUser.pending, (state, action) => {
      state.signupSuccess = false;
    });

    builder.addCase(logInUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

    builder.addCase(logOutUser.fulfilled, (state, action) => {
      state.currentUser = null;
    });
  },
});

export default userSlice.reducer;
