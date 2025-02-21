import mongoose, { HydratedDocument, Schema } from "mongoose";

export enum Currency {
  Eur = "eur",
  Huf = "huf",
  Usd = "usd",
  Php = "php",
}

export interface IPayment {
  currency: Currency;
  amount: number;
  convertedTo: Currency;
  convertedAmount: number;
  exchangeRate: number;
}

export interface IExpenseRecord {
  userId: Schema.Types.ObjectId;
  date: number;
  paymentMethod: string;
  paidTo: string;
  description: string;
  category: string;
  payment: IPayment;
}

const payment = new mongoose.Schema<IPayment>(
  {
    currency: {
      type: String,
      enum: Object.values(Currency),
    },
    amount: Number,
    convertedTo: {
      type: String,
      enum: Object.values(Currency),
    },
    convertedAmount: Number,
    exchangeRate: Number,
  },
  {
    _id: false,
  },
);

const expenseSchema = new mongoose.Schema<IExpenseRecord>({
  userId: Schema.Types.ObjectId,
  date: Number,
  paymentMethod: String,
  paidTo: String,
  description: String,
  category: String,
  payment: payment,
});

export const ExpenseRecord = mongoose.model("Expense", expenseSchema);

export interface PaymentDto {
  currency: Currency;
  amount: number;
  convertedTo: Currency;
  convertedAmount: number;
  exchangeRate: number;
}

export interface ExpenseDto {
  _id: string;
  date: number;
  paymentMethod: string;
  paidTo: string;
  description: string;
  category: string;
  payment: PaymentDto;
}

export function expenseToDto(
  expense: HydratedDocument<IExpenseRecord>,
): ExpenseDto {
  return {
    _id: expense._id.toHexString(),
    category: expense.category,
    date: expense.date,
    description: expense.description,
    paidTo: expense.paidTo,
    payment: expense.payment,
    paymentMethod: expense.paymentMethod,
  };
}

export type CreateExpenseDto = Pick<
  ExpenseDto,
  "date" | "paymentMethod" | "paidTo" | "description" | "category" | "payment"
>;

export type UpdateExpenseDto = Pick<
  ExpenseDto,
  "date" | "paymentMethod" | "paidTo" | "description" | "category" | "payment"
>;
