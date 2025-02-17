import { configureStore } from "@reduxjs/toolkit";
import { expenseReducer } from "./expense";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
