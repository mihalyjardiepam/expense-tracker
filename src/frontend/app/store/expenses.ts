import { createSlice } from "@reduxjs/toolkit";
import type { ExpenseRecord } from "~/models/expense";

const initialState: ExpenseRecord[] = [];

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
});
