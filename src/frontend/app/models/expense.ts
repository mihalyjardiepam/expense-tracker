import type { IdType } from "./id-type";
import type { Payment } from "./payment";
import type { UnixTimestampMs } from "./unix-timestamp-ms";

/**
 * A record of an expense.
 */
export interface ExpenseRecord {
  _id: IdType;
  userId: IdType;
  date: UnixTimestampMs;
  paymentMethod: string;
  paidTo: string;
  description: string;
  category: string;
  payment: Payment;
}

export type CreateExpense = Pick<
  ExpenseRecord,
  "date" | "paymentMethod" | "paidTo" | "description" | "category" | "payment"
>;

export type UpdateExpense = Pick<
  ExpenseRecord,
  "date" | "paymentMethod" | "paidTo" | "description" | "category" | "payment"
>;
