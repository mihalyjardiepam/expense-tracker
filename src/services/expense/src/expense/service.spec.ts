import mongoose from "mongoose";
import { DbTestingModule } from "../lib/test/db-testing";
import { ExpenseService } from "./service";
import { Currency, ExpenseRecord } from "../models/expense-record";

describe("expense service tests", () => {
  let dbModule: DbTestingModule;
  let expenseService: ExpenseService;
  beforeAll(async () => {
    await DbTestingModule.init();
    dbModule = new DbTestingModule("expense-service");
    await dbModule.mongodbConnect();
  });

  beforeEach(async () => {
    await dbModule.mongodbResetDb();
    expenseService = new ExpenseService();
  });

  it("creates a record", async () => {
    const expense = await expenseService.createExpense(
      new mongoose.Types.ObjectId().toHexString(),
      {
        category: "test",
        date: new Date().getTime(),
        description: "Testing expenses",
        paidTo: "no one",
        payment: {
          amount: 20.0,
          currency: Currency.Eur,
          convertedAmount: 20.0,
          convertedTo: Currency.Eur,
          exchangeRate: 1,
        },
        paymentMethod: "none",
      },
    );

    const record = await ExpenseRecord.findOne({
      _id: expense.id,
    });

    expect(record.category).toBe("test");
  });

  it("queries expenses properly", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const expensePromises = [
      new ExpenseRecord({
        category: "testing1",
        date: 100,
        description: "description",
        paidTo: "1",
        payment: {},
        paymentMethod: "cash",
        userId: userId,
      }),
      new ExpenseRecord({
        category: "testing1",
        date: 100,
        description: "description",
        paidTo: "2",
        payment: {},
        paymentMethod: "cash",
        userId: userId,
      }),
      new ExpenseRecord({
        category: "testing2",
        date: 100,
        description: "description",
        paidTo: "3",
        payment: {},
        paymentMethod: "cash",
        userId: userId,
      }),
      new ExpenseRecord({
        category: "testing2",
        date: 200,
        description: "description",
        paidTo: "4",
        payment: {},
        paymentMethod: "cash",
        userId: userId,
      }),
      new ExpenseRecord({
        category: "testing2",
        date: 200,
        description: "description",
        paidTo: "5",
        payment: {},
        paymentMethod: "cash",
        userId: userId,
      }),
    ].map((exp) => exp.save());

    await Promise.all(expensePromises);

    let expenses = await expenseService.queryExpense(userId, {
      category: "testing1",
    });

    expect(expenses).toHaveLength(2);
    expect(expenses.find((e) => e.paidTo == "1")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "2")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "3")).toBe(undefined);

    expenses = await expenseService.queryExpense(userId, {
      date: {
        to: 199,
      },
    });

    expect(expenses).toHaveLength(3);
    expect(expenses.find((e) => e.paidTo == "1")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "2")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "3")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "4")).toBe(undefined);

    expenses = await expenseService.queryExpense(userId, {
      date: {
        from: 101,
        to: 200,
      },
    });

    expect(expenses).toHaveLength(2);
    expect(expenses.find((e) => e.paidTo == "1")).toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "2")).toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "3")).toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "4")).not.toBe(undefined);
    expect(expenses.find((e) => e.paidTo == "5")).not.toBe(undefined);
  });

  it("updates expenses", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    let expense = await new ExpenseRecord({
      category: "update",
      date: 0,
      description: "testing updates",
      paidTo: "test",
      payment: {},
      paymentMethod: "cash",
      userId,
    }).save();

    await expenseService.updateExpense(expense.id, userId, {
      category: "new category",
      date: 0,
      description: "testing updates",
      paidTo: "test",
      payment: {
        amount: 0,
        convertedAmount: 0,
        convertedTo: Currency.Eur,
        currency: Currency.Eur,
        exchangeRate: 1,
      },
      paymentMethod: "cash",
    });

    expense = await ExpenseRecord.findOne({
      _id: expense.id,
    });

    expect(expense.category).toBe("new category");
  });

  it("deletes expenses", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    let expense = await new ExpenseRecord({
      category: "delete",
      date: 0,
      description: "testing deletes",
      paidTo: "test",
      payment: {},
      paymentMethod: "cash",
      userId,
    }).save();

    await expenseService.deleteExpense(expense.id, userId);

    expense = await ExpenseRecord.findOne({
      _id: expense.id,
    });

    expect(expense).toBe(null);
  });

  afterAll(async () => {
    await dbModule.mongodbCloseDb();
  });
});
