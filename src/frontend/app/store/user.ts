import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { data } from "react-router";
import { appCreateAsyncThunk } from "~/hooks/redux";
import { generateRandomColor } from "~/lib/generate-random-color";
import type { ExpenseRecord } from "~/models/expense";
import type { UpdateUser, User } from "~/models/user";

export const loadUser = appCreateAsyncThunk(
  "user/load",
  async (_, thunkApi) => {
    const response = await thunkApi.extra.authFetch("/user");

    if (response.ok) {
      return (await response.json()) as User;
    }

    return null;
  },
);

export const addSuggestValuesFromExpense = appCreateAsyncThunk(
  "user/createPatch",
  (data: ExpenseRecord, thunkApi) => {
    const user = thunkApi.getState().user.user;

    if (!user) {
      return;
    }

    let patch: Partial<UpdateUser> = {};

    if (!user.categories.some((cat) => cat.value === data.category)) {
      patch = {
        ...patch,
        categories: [
          ...user.categories,
          {
            color: generateRandomColor(),
            value: data.category,
          },
        ],
      };
    }

    if (!user.paidTos.some((cat) => cat.value === data.paidTo)) {
      patch = {
        ...patch,
        paidTos: [
          ...user.paidTos,
          {
            color: generateRandomColor(),
            value: data.paidTo,
          },
        ],
      };
    }

    if (!user.paymentMethods.some((cat) => cat.value === data.paymentMethod)) {
      patch = {
        ...patch,
        paymentMethods: [
          ...user.paymentMethods,
          {
            color: generateRandomColor(),
            value: data.paymentMethod,
          },
        ],
      };
    }

    if (Object.keys(patch).length > 0) {
      thunkApi.dispatch(patchUser(patch));
    }
  },
);

export const patchUser = appCreateAsyncThunk(
  "user/patch",
  async (data: Partial<UpdateUser>, thunkApi) => {
    const result = await thunkApi.extra.authFetch(`/user`, {
      body: JSON.stringify(data),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      return (await result.json()) as User;
    }

    const response = await result.text();

    throw new Error(`Failed to update user: ${response}`);
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: <User | null>null,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
