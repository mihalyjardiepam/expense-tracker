import { useCallback, useState } from "react";
import Dialog from "~/components/dialog/Dialog";
import ExpenseForm from "~/components/expense/ExpenseForm";
import ExpenseTable from "~/components/expense/ExpenseTable";

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
        <h1>Expenses</h1>
        <div className="flex-spacer"></div>
        <button className="app-btn color-primary" onClick={openExpenseDialog}>
          Add Expense
        </button>
      </div>
      <ExpenseTable></ExpenseTable>
      <Dialog isOpen={modalOpen} setIsOpen={expenseDialogRequestClose}>
        <ExpenseForm onClose={expenseDialogRequestClose}></ExpenseForm>
      </Dialog>
    </>
  );
}

export default ExpenseTablePage;
