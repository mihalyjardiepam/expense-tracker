import { HydratedDocument } from "mongoose";
import {
  CreateExpenseDto,
  ExpenseRecord,
  IExpenseRecord,
  UpdateExpenseDto,
} from "../models/expense-record";

export interface ExpenseQuery {
  date?: {
    from?: number;
    to?: number;
  };
  paymentMethod?: string;
  paidTo?: string;
  description?: string;
  category?: string;
}

export class ExpenseService {
  public async queryExpense(
    userId: string,
    query: ExpenseQuery,
  ): Promise<HydratedDocument<IExpenseRecord>[]> {
    const filter: Record<string, any> = {
      userId: userId,
    };

    if (query.date) {
      filter["date"] = {};
      if (query.date.from) {
        filter["date"] = {
          ...filter["date"],
          $gte: query.date.from,
        };
      }

      if (query.date.to) {
        filter["date"] = {
          ...filter["date"],
          $lte: query.date.to,
        };
      }
    }

    if (query.paymentMethod) {
      filter["paymentMethod"] = query.paymentMethod;
    }

    if (query.paidTo) {
      filter["paidTo"] = query.paidTo;
    }

    if (query.description) {
      filter["description"] = query.description;
    }

    if (query.category) {
      filter["category"] = query.category;
    }

    return await ExpenseRecord.find(filter);
  }

  public async createExpense(
    userId: string,
    data: CreateExpenseDto,
  ): Promise<HydratedDocument<IExpenseRecord>> {
    const record = new ExpenseRecord({
      userId: userId,
      category: data.category,
      date: data.date,
      description: data.description,
      paidTo: data.paidTo,
      payment: data.payment,
      paymentMethod: data.paymentMethod,
    });

    return await record.save();
  }

  public async updateExpense(
    expenseId: string,
    userId: string,
    data: UpdateExpenseDto,
  ): Promise<boolean> {
    const result = await ExpenseRecord.updateOne(
      {
        _id: expenseId,
        userId: userId,
      },
      {
        $set: {
          category: data.category,
          date: data.date,
          description: data.description,
          paidTo: data.paidTo,
          payment: data.payment,
          paymentMethod: data.paymentMethod,
        },
      },
    );

    // If there aren't any updates, the _id was wrong, meaning we can return a
    // 404 error.
    return result.modifiedCount == 1;
  }

  public async deleteExpense(expenseId: string, userId: string) {
    await ExpenseRecord.deleteOne({
      _id: expenseId,
      userId: userId,
    });
  }
}
