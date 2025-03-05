import React, {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";
import "./ExpenseTable.scss";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { deleteExpense, fetchExpenses } from "~/store/expense";
import { formatTimestampYYYYMMDD } from "~/lib/format-timestamp";
import { CurrencySymbols } from "~/models/currency";
import Dialog from "../dialog/Dialog";
import type { ExpenseRecord } from "~/models/expense";
import ExpenseForm from "./ExpenseForm";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useSnackbar } from "notistack";

const format = new Intl.NumberFormat();

const ExpenseTable = () => {
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const dispatch = useAppDispatch();
  const [sum, setSum] = useState(0);
  const user = useAppSelector((state) => state.user.user);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExpenseRecord | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // any: typedefs are messed up in redux at the moment and there is
    // no accepted solution for this problem. I don't care anymore so I just
    // cast the thunk to any.
    // It's definitely not gonna bite me in the rear later.
    dispatch(fetchExpenses() as any);
  }, []);

  useEffect(() => {
    setSum(
      expenses.reduce((prev, curr) => {
        return prev + curr.payment.convertedAmount;
      }, 0),
    );

    if (selectedItem != null) {
      const selectedExpense = expenses.find(
        (exp) => exp._id === selectedItem._id,
      );

      setSelectedItem(selectedExpense ?? null);
    }
  }, [expenses]);

  const setSelection = useCallback(
    (expense: ExpenseRecord) => {
      if (selectedItem === expense) {
        setSelectedItem(null);
      } else {
        setSelectedItem(expense);
      }
    },
    [setSelectedItem, selectedItem],
  );

  const handleKeyboardEvent = useCallback(
    (evt: KeyboardEvent, expense: ExpenseRecord) => {
      if (evt.key == " ") {
        setSelection(expense);
      }
    },
    [setSelectedItem, selectedItem],
  );

  const editSelectedItem = useCallback(() => {
    setEditDialogOpen(true);
  }, [selectedItem, setEditDialogOpen]);

  const deleteSelectedItem = useCallback(async () => {
    if (selectedItem) {
      try {
        await dispatch(deleteExpense(selectedItem._id) as any);
        setSelectedItem(null);
        setConfirmDialogOpen(false);

        enqueueSnackbar("Successfully deleted record.", { variant: "success" });
      } catch (error) {
        console.error(error);
      }
    }
  }, [selectedItem, setSelectedItem]);

  return (
    <>
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
          <tbody role="listbox">
            {expenses.map((expense) => (
              <tr
                className={`expense-row-select ${
                  expense == selectedItem ? "selected" : ""
                }`}
                role="option"
                aria-pressed={expense == selectedItem}
                key={expense._id}
                tabIndex={0}
                onClick={() => setSelection(expense)}
                onKeyDown={(e) => handleKeyboardEvent(e, expense)}
              >
                <td className="nobreak">
                  {formatTimestampYYYYMMDD(expense.date)}
                </td>
                <td>{expense.paidTo}</td>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td className="nobreak payment-amount">
                  {CurrencySymbols[expense.payment.convertedTo]}{" "}
                  {format.format(expense.payment.convertedAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tbody>
            <tr>
              <th>Total</th>
              <td colSpan={4}>
                {CurrencySymbols[user!.defaultCurrency]} {format.format(sum)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {selectedItem && (
        <div className="expense-actions" role="menubar">
          <button
            role="menuitem"
            className="app-btn color-primary"
            onClick={editSelectedItem}
          >
            Edit
          </button>
          <button
            role="menuitem"
            className="app-btn color-secondary"
            onClick={() => setConfirmDialogOpen(true)}
          >
            Delete
          </button>
        </div>
      )}
      <Dialog isOpen={editDialogOpen} setIsOpen={setEditDialogOpen}>
        {selectedItem && (
          <ExpenseForm
            expense={selectedItem}
            onClose={() => setEditDialogOpen(false)}
          ></ExpenseForm>
        )}
      </Dialog>
      <Dialog isOpen={confirmDialogOpen} setIsOpen={setConfirmDialogOpen}>
        <ConfirmDialog
          confirmText="Are you sure you want to delete the selected Record?"
          acceptAction="Yes, Delete It"
          rejectAction="Cancel"
          onAccept={deleteSelectedItem}
          onReject={() => setConfirmDialogOpen(false)}
        ></ConfirmDialog>
      </Dialog>
    </>
  );
};

export default React.memo(ExpenseTable);
