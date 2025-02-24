import React, { useEffect } from "react";
import "./ExpenseTable.scss";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { fetchExpenses } from "~/store/expense";
import { timestampToDate } from "~/lib/timestamp-to-date";
import { CurrencySymbols } from "~/models/currency";

const ExpenseTable = () => {
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // any: typedefs are messed up in the library at the moment and there is
    // no accepted solution for this problem. I don't care anymore so I just
    // cast the thunk to any.
    // It's definitely not gonna bite me in the rear later.
    dispatch(fetchExpenses() as any);
  }, []);

  return (
    <div className="table-wrapper">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th className="nobreak">Paid To</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td className="nobreak">{timestampToDate(expense.date)}</td>
              <td>{expense.paidTo}</td>
              <td>{expense.description}</td>
              <td>{expense.category}</td>
              <td className="nobreak payment-amount">
                {expense.payment.convertedAmount}{" "}
                {CurrencySymbols[expense.payment.convertedTo]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ExpenseTable);
