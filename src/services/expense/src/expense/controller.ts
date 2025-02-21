import { Request, Response } from "express";
import { ExpenseQuery, ExpenseService } from "./service";
import {
  CreateExpenseDto,
  ExpenseDto,
  expenseToDto,
  UpdateExpenseDto,
} from "../models/expense-record";

const service = new ExpenseService();

export async function query(req: Request, res: Response) {
  const userId = req.user["sub"];
  const expenseQuery: ExpenseQuery = {};
  const { query } = req;

  if (query["date.from"]) {
    expenseQuery.date = {
      ...expenseQuery.date,
      from: Number(query["date.from"]),
    };
  }

  if (query["date.to"]) {
    expenseQuery.date = {
      ...expenseQuery.date,
      to: Number(query["date.to"]),
    };
  }

  if (query["paymentMethod"]) {
    expenseQuery.paymentMethod = query["paymentMethod"].toString();
  }

  if (query["paidTo"]) {
    expenseQuery.paidTo = query["paidTo"].toString();
  }

  if (query["description"]) {
    expenseQuery.description = query["description"].toString();
  }

  if (query["category"]) {
    expenseQuery.category = query["category"].toString();
  }

  const results: ExpenseDto[] = (
    await service.queryExpense(userId, expenseQuery)
  ).map(expenseToDto);

  res.status(200).json(results);
}

export async function create(req: Request, res: Response) {
  if (!req.body["date"] || !req.body["payment"]) {
    res.status(400).json({
      error: "Date and Payment fields are required.",
    });
    return;
  }

  const userId = req.user["sub"];

  const createData: CreateExpenseDto = {
    category: req.body["category"] || "",
    date: Number(req.body["date"]),
    description: req.body["description"],
    paidTo: req.body["paidTo"],
    payment: req.body["payment"],
    paymentMethod: req.body["paymentMethod"],
  };

  const expense = await service.createExpense(userId, createData);

  res.status(200).json(expenseToDto(expense));
}

export async function update(req: Request, res: Response) {
  if (!req.body["date"] || !req.body["payment"]) {
    res.status(400).json({
      error: "Date and Payment fields are required.",
    });
    return;
  }

  const expenseId = req.params["id"];
  const userId = req.user["sub"];

  const updateData: UpdateExpenseDto = {
    category: req.body["category"] || "",
    date: Number(req.body["date"]),
    description: req.body["description"],
    paidTo: req.body["paidTo"],
    payment: req.body["payment"],
    paymentMethod: req.body["paymentMethod"],
  };

  const success = await service.updateExpense(expenseId, userId, updateData);

  res.status(success ? 204 : 404).send();
}

export async function del(req: Request, res: Response) {
  const expenseId = req.params["id"];
  const userId = req.user["sub"];

  await service.deleteExpense(expenseId, userId);
  res.status(200).send();
}
