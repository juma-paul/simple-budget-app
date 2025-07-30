import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Generic
    loading: false,
    error: null,
    success: null,
    message: null,

    // Update action status
    updateLoading: false,
    updateError: null,
    updateSuccess: null,
    updateMessage: null,

    // Restore action status
    restoreLoading: false,
    restoreError: null,
    restoreSuccess: null,
    restoreMessage: null,

    // Delete action status
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: null,
    deleteMessage: null,
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

    // Update
    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },
    setUpdateError: (state, action) => {
      state.updateError = action.payload;
    },
    setUpdateSuccess: (state, action) => {
      state.updateSuccess = action.payload;
    },
    setUpdateMessage: (state, action) => {
      state.updateMessage = action.payload;
    },

    // Restore
    setRestoreLoading: (state, action) => {
      state.restoreLoading = action.payload;
    },
    setRestoreError: (state, action) => {
      state.restoreError = action.payload;
    },
    setRestoreSuccess: (state, action) => {
      state.restoreSuccess = action.payload;
    },
    setRestoreMessage: (state, action) => {
      state.restoreMessage = action.payload;
    },

    // Delete
    setDeleteLoading: (state, action) => {
      state.deleteLoading = action.payload;
    },
    setDeleteError: (state, action) => {
      state.deleteError = action.payload;
    },
    setDeleteSuccess: (state, action) => {
      state.deleteSuccess = action.payload;
    },
    setDeleteMessage: (state, action) => {
      state.deleteMessage = action.payload;
    },

    clearUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = null;
      state.updateMessage = null;
    },

    clearRestoreState: (state) => {
      state.restoreLoading = false;
      state.restoreError = null;
      state.restoreSuccess = null;
      state.restoreMessage = null;
    },

    clearDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = null;
      state.deleteMessage = null;
    },
    clearUIState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
});

export const {
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
} = uiSlice.actions;
export default uiSlice.reducer;
