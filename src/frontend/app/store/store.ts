import { useAuthentication } from "~/hooks/use-authentication";
import { configureStore } from "@reduxjs/toolkit";
import { expenseReducer } from "./expense";
import { useServiceDiscovery } from "~/hooks/use-service-discovery";
import { userReducer } from "./user";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          expenseFetch: useAuthentication(useServiceDiscovery("expense")),
          authFetch: useAuthentication(useServiceDiscovery("auth")),
        },
      },
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
