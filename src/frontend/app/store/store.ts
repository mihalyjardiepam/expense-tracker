import { configureStore } from "@reduxjs/toolkit";
import { expenseReducer } from "./expense";
import { useFetch } from "~/hooks/use-fetch";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          expenseFetch: useFetch("expense")[0],
        },
      },
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
