import React from "react";
import "./ExpenseTable.scss";

const ExpenseTable = () => {
  return (
    <div className="table-wrapper">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid To</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="nobreak">2025-01-01</td>
            <td>Example Store</td>
            <td></td>
            <td>groceries</td>
            <td className="nobreak">6,400 HUF</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ExpenseTable);
