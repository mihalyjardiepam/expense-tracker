import { Outlet } from "react-router";
import "./dashboard.scss";
import React, { useCallback, useState } from "react";
import Dialog from "~/components/dialog/Dialog";
import ExpenseForm from "~/components/expense/ExpenseForm";

function Dashboard() {
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
        <h1>Expenses</h1>
        <div className="flex-spacer"></div>
        <button className="app-btn color-primary" onClick={openExpenseDialog}>
          Add Expense
        </button>
      </div>
      <Outlet />
      <Dialog isOpen={modalOpen} setIsOpen={expenseDialogRequestClose}>
        <ExpenseForm onClose={expenseDialogRequestClose}></ExpenseForm>
      </Dialog>
    </>
  );
}

export default React.memo(Dashboard);
