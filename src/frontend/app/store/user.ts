import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
