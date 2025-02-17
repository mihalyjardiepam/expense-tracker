import type { IdType } from "./id-type";
import type { Payment } from "./payment";
import type { UnixTimestampMs } from "./unix-timestamp-ms";

/**
 * A record of an expense.
 */
export interface ExpenseRecord {
  id: IdType;
  userId: IdType;
  date: UnixTimestampMs;
  paymentMethod: string;
  paidTo: string;
  description: string;
  category: string;
  paymentDetails: Payment;
}

export type CreateExpense = Pick<
  ExpenseRecord,
  | "date"
  | "paymentMethod"
  | "paidTo"
  | "description"
  | "category"
  | "paymentDetails"
>;

export type UpdateExpense = Pick<
  ExpenseRecord,
  | "date"
  | "paymentMethod"
  | "paidTo"
  | "description"
  | "category"
  | "paymentDetails"
>;
