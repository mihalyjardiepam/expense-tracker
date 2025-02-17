import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ExpenseRecord } from "~/models/expense";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    return <ExpenseRecord[]>[];
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: <ExpenseRecord[]>[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });
  },
});

export const expenseReducer = expenseSlice.reducer;
