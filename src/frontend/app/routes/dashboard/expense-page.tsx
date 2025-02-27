import React, { useCallback, useMemo, useState } from "react";
import Dialog from "~/components/dialog/Dialog";
import ExpenseForm from "~/components/expense/ExpenseForm";
import ExpenseTable from "~/components/expense/ExpenseTable";
import "./expense-page.scss";
import ExpenseMonthSelect from "~/components/expense/ExpenseMonthSelect";

function ExpenseTablePage() {
  const [modalOpen, setModalOpen] = useState(false);

  const openExpenseDialog = useCallback(() => {
    setModalOpen(true);
  }, []);

  const expenseDialogRequestClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <div className="expense-title">
        <h2>My Expenses</h2>
        <div className="flex-spacer"></div>
        <button className="app-btn color-primary" onClick={openExpenseDialog}>
          Add Expense
        </button>
      </div>
      <ExpenseMonthSelect />
      <ExpenseTable />
      <Dialog isOpen={modalOpen} setIsOpen={expenseDialogRequestClose}>
        <ExpenseForm onClose={expenseDialogRequestClose}></ExpenseForm>
      </Dialog>
    </>
  );
}

export default React.memo(ExpenseTablePage);
