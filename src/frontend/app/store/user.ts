import { createSlice } from "@reduxjs/toolkit";
import { appCreateAsyncThunk } from "~/hooks/redux";
import type { User } from "~/models/user";

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

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: <User | null>null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const {} = userSlice.actions;
export const userReducer = userSlice.reducer;
