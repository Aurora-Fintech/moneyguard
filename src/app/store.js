import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
// import transactionsReducer from "../features/transactions/transactionsSlice.js"; 
import currencyReducer from "../features/currency/currencySlice.js";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};


const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  

  // transactions: transactionsReducer, 
  currency: currencyReducer,        

});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);