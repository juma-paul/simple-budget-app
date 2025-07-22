import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  setLoading,
  setError,
  setSuccess,
  setMessage,
  clearUIState,
} from "../ui/uiSlice.js";

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
      const res = await fetch("/api/auth/logout", {
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

// Google OAuth
export const googleAuthUser = createAsyncThunk(
  "user/googleAuthUser",
  async ({ payload, isConsentFollowUp = false }, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;

    dispatch(clearUIState());
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "consent_required" && !isConsentFollowUp) {
        dispatch(setLoading(false));
        return { type: "consent_required", tempUserData: data.tempUserData };
      }

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      dispatch(setSuccess(true));
      dispatch(setMessage(data.message || "Google login successful"));
      return { type: "success", userData: data };
    } catch (error) {
      dispatch(setError(true));
      dispatch(setMessage(error.message || "Google login failed"));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    signupSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.signupSuccess = true;
      })

      .addCase(signUpUser.pending, (state, action) => {
        state.signupSuccess = false;
      })

      .addCase(logInUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      .addCase(logOutUser.fulfilled, (state, action) => {
        state.currentUser = null;
        state.signupSuccess = false;
      })

      .addCase(googleAuthUser.fulfilled, (state, action) => {
        if (action.payload.type === "success") {
          state.currentUser = action.payload.userData;
        }
      });
  },
});

export default userSlice.reducer;
