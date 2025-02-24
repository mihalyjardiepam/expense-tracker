import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { appCreateAsyncThunk } from "~/hooks/redux";
import type { ExpenseRecord } from "~/models/expense";

export const fetchExpenses = appCreateAsyncThunk(
  "expenses/fetchExpenses",
  async (_, thunkApi) => {
    console.log("Fetch");

    const response = await thunkApi.extra.expenseFetch("/expenses", {
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error("Failed to fetch resource");
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: <ExpenseRecord[]>[],
  },
  reducers: {
    expenseAdded: (store, arg: PayloadAction<ExpenseRecord>) => {
      store.expenses.push(arg.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });
  },
});

export const { expenseAdded } = expenseSlice.actions;

export const expenseReducer = expenseSlice.reducer;
