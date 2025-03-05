import type { Currency } from "./currency";
import type { ValueWithColor } from "./value-with-color";

export interface User {
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
  User,
  | "categories"
  | "defaultCurrency"
  | "email"
  | "name"
  | "paidTos"
  | "paymentMethods"
  | "registeredAt"
>;
