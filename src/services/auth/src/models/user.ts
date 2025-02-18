import mongoose from "mongoose";
import { Currency } from "./currency";

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
