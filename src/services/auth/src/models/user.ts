import mongoose from "mongoose";
import { Currency } from "./currency";

export interface ValueWithColor {
  value: string;
  color: string;
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  registeredAt: Number,
  password: String,
  defaultCurrency: {
    type: String,
    enum: Object.values(Currency),
  },
  paymentMethods: [{ value: String, color: String }],
  paidTos: [{ value: String, color: String }],
  categories: [{ value: String, color: String }],
});

export const User = mongoose.model("User", userSchema);

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  registeredAt: number;
  defaultCurrency: Currency;
  paymentMethods: ValueWithColor[];
  paidTos: ValueWithColor[];
  categories: ValueWithColor[];
}
