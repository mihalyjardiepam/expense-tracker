import type {
  CreateExpense,
  ExpenseRecord,
  UpdateExpense,
} from "~/models/expense";
import { LocalStorageService } from "./local-storage-service";
import { generateId } from "~/lib/generate-id";
import type { IdType } from "~/models/id-type";

const EXPENSE_LOCALSTORAGE_KEY = "__rext_expenses";

export class ExpenseService extends LocalStorageService<ExpenseRecord[]> {
  constructor() {
    super(EXPENSE_LOCALSTORAGE_KEY, []);
  }

  async getExpenses() {
    return await this.getStorage();
  }

  async createExpense(data: CreateExpense): Promise<ExpenseRecord> {
    const newRecord: ExpenseRecord = {
      ...data,
      id: generateId(),
      userId: "123",
    };

    const expenses = await this.getStorage();
    expenses.push(newRecord);
    this.setStorage(expenses);

    return newRecord;
  }

  async updateExpense(id: IdType, data: UpdateExpense): Promise<ExpenseRecord> {
    const expenses = await this.getStorage();
    const index = expenses.findIndex((exp) => exp.id === id);
    expenses[index] = {
      ...expenses[index],
      ...data,
    };

    this.setStorage(expenses);

    return expenses[index];
  }

  async deleteExpense(id: IdType): Promise<void> {
    let expenses = await this.getStorage();
    expenses = expenses.filter((expense) => expense.id !== id);
    this.setStorage(expenses);
  }
}
