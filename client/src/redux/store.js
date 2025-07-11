import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice.js";
import uiReducer from "./features/ui/uiSlice.js";
import storage from "redux-persist/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
