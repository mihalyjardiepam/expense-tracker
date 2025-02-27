import mongoose, { HydratedDocument } from "mongoose";
import { Currency } from "./currency";

export interface ValueWithColor {
  value: string;
  color: string;
}

export interface IUser {
  name: string;
  email: string;
  registeredAt: number;
  password: string;
  defaultCurrency: Currency;
  paymentMethods: ValueWithColor[];
  paidTos: ValueWithColor[];
  categories: ValueWithColor[];
}

const userSchema = new mongoose.Schema<IUser>({
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

export type UpdateUser = Pick<
  UserDto,
  "categories" | "name" | "paidTos" | "paymentMethods"
>;

export function userToDto(user: HydratedDocument<IUser>): UserDto {
  return {
    _id: user._id.toHexString(),
    categories: user.categories as ValueWithColor[],
    defaultCurrency: user.defaultCurrency,
    email: user.email,
    name: user.name,
    paidTos: user.paidTos as ValueWithColor[],
    paymentMethods: user.paymentMethods as ValueWithColor[],
    registeredAt: user.registeredAt,
  };
}
