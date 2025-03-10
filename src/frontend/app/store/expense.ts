import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { appCreateAsyncThunk } from "~/hooks/redux";
import { getRangeFromMonth } from "~/models/date-range";
import type {
  CreateExpense,
  ExpenseRecord,
  UpdateExpense,
} from "~/models/expense";
import type { UnixTimestampMs } from "~/models/unix-timestamp-ms";

export interface DisplayParams {
  displayMonth: UnixTimestampMs;
}

export const fetchExpenses = appCreateAsyncThunk<ExpenseRecord[], void>(
  "expenses/fetchExpenses",
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const date = new Date(state.expenses.displayParams.displayMonth);
    const { from, to } = getRangeFromMonth(date.getFullYear(), date.getMonth());
    const query = `date.from=${from}&date.to=${to}`;

    const response = await thunkApi.extra.expenseFetch(`/expenses?${query}`, {
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error("Failed to fetch resource");
  },
);

export const createExpense = appCreateAsyncThunk<ExpenseRecord, CreateExpense>(
  "expenses/createExpense",
  async (data, thunkApi) => {
    const response = await thunkApi.extra.expenseFetch(`/expenses`, {
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.ok) {
      return await response.json();
    } else {
      let errorMessage: string;
      try {
        const error = await response.json();
        errorMessage = error.error;
      } catch (error) {
        errorMessage = "Unknown error";
      }

      throw new Error(`Failed to create expense: ${errorMessage}`);
    }
  },
);

export const updateExpense = appCreateAsyncThunk<
  void,
  { id: string; data: UpdateExpense }
>("expenses/updateExpense", async (data, thunkApi) => {
  const response = await thunkApi.extra.expenseFetch(`/expenses/${data.id}`, {
    body: JSON.stringify(data.data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const error = await response.json();
      errorMessage = error.error;
    } catch (error) {
      errorMessage = "Unknown error";
    }

    throw new Error(`Failed to update expense: ${errorMessage}`);
  }
});

export const deleteExpense = appCreateAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId: string, thunkApi) => {
    const response = await thunkApi.extra.expenseFetch(
      `/expenses/${expenseId}`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete expense.");
    }
  },
);

export const updateDisplayParams = appCreateAsyncThunk<void, DisplayParams>(
  "expenses/updateDisplayParams",
  async (params, thunkApi) => {
    await thunkApi.dispatch(displayParamsUpdated(params));
    await thunkApi.dispatch(fetchExpenses() as any);
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: <ExpenseRecord[]>[],
    displayParams: <DisplayParams>{
      displayMonth: new Date().getTime(),
    },
  },
  reducers: {
    expenseAdded: (store, arg: PayloadAction<ExpenseRecord>) => {
      store.expenses.push(arg.payload);
    },
    expenseUpdated: (store, arg: PayloadAction<ExpenseRecord>) => {
      const expenseIndex = store.expenses.findIndex(
        (expense) => expense._id == arg.payload._id,
      );
      if (expenseIndex == -1) {
        store.expenses.push(arg.payload);
      } else {
        store.expenses[expenseIndex] = arg.payload;
      }
    },
    expenseDeleted: (store, arg: PayloadAction<string>) => {
      store.expenses = store.expenses.filter((exp) => exp._id !== arg.payload);
    },
    displayParamsUpdated: (store, arg: PayloadAction<DisplayParams>) => {
      store.displayParams = arg.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });

    builder.addCase(createExpense.fulfilled, (state, action) => {
      state.expenses.push(action.payload);
    });

    builder.addCase(updateExpense.fulfilled, (state, action) => {
      let expenseIndex = state.expenses.findIndex(
        (exp) => exp._id === action.meta.arg.id,
      );

      if (expenseIndex == -1) {
        return;
      }

      state.expenses[expenseIndex] = {
        ...state.expenses[expenseIndex],
        ...action.meta.arg.data,
      };
    });

    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.expenses = state.expenses.filter(
        (exp) => exp._id !== action.meta.arg,
      );
    });
  },
});

export const { expenseAdded, expenseUpdated, displayParamsUpdated } =
  expenseSlice.actions;

export const expenseReducer = expenseSlice.reducer;
