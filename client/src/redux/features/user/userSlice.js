import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  // Generic
  setLoading,
  setError,
  setSuccess,
  setMessage,
  clearUIState,

  // Update
  setUpdateLoading,
  setUpdateError,
  setUpdateSuccess,
  setUpdateMessage,
  clearUpdateState,

  // Restore
  setRestoreLoading,
  setRestoreError,
  setRestoreSuccess,
  setRestoreMessage,
  clearRestoreState,

  // Delete
  setDeleteLoading,
  setDeleteError,
  setDeleteSuccess,
  setDeleteMessage,
  clearDeleteState,
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

// Update User
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const state = thunkAPI.getState();
    const userId = state.user.currentUser.data._id;

    dispatch(clearUpdateState());
    dispatch(setUpdateLoading(true));

    try {
      const res = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      dispatch(setUpdateSuccess(true));
      dispatch(
        setUpdateMessage(data.message || "Profile updated successfully")
      );

      return data;
    } catch (error) {
      dispatch(setUpdateError(true));
      dispatch(setUpdateMessage(error.message || "Something went wrong!"));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

// Delete User's account
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (formData, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const state = thunkAPI.getState();
    const userId = state.user.currentUser.data._id;

    dispatch(clearDeleteState());
    dispatch(setDeleteLoading(true));

    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete account!");
      }

      dispatch(setDeleteSuccess(true));
      dispatch(
        setDeleteMessage(data.message || "Account deleted successfully")
      );
      return;
    } catch (error) {
      dispatch(setDeleteError(true));
      dispatch(setDeleteMessage(error.message || "Failed to delete account!"));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      dispatch(setDeleteLoading(false));
    }
  }
);

// Restore deleted account
export const restoreUser = createAsyncThunk(
  "user/restoreUser",
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const state = thunkAPI.getState();
    const userId = state.user.currentUser.data._id;

    dispatch(clearRestoreState());
    dispatch(setRestoreLoading(true));

    try {
      const res = await fetch(`/api/user/restore/${userId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      dispatch(setRestoreSuccess(true));
      dispatch(
        setRestoreMessage(data.message || "Account restored successfully")
      );
      return;
    } catch (error) {
      dispatch(setRestoreError(true));
      dispatch(setRestoreMessage(error.message || "Something went wrong!"));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setRestoreLoading(false));
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
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.currentUser = null;
      })

      .addCase(restoreUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export default userSlice.reducer;
