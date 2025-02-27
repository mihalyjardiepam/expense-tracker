import { formatTimestampMonthYear } from "~/lib/format-timestamp";
import "./ExpenseMonthSelect.scss";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { useCallback } from "react";
import { updateDisplayParams } from "~/store/expense";
import MatIcon from "../mat-icon/MatIcon";

const ExpenseMonthSelect = () => {
  const displayParams = useAppSelector((state) => state.expenses.displayParams);
  const dispatch = useAppDispatch();

  const stepMonth = useCallback(
    (direction: number) => {
      const currentDate = new Date(displayParams.displayMonth);
      const modifiedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1 * direction,
        1,
      );

      dispatch(
        updateDisplayParams({
          displayMonth: modifiedDate.getTime(),
        }) as any,
      );
    },
    [displayParams],
  );

  return (
    <div className="expense-month-selector">
      <button
        className="stepper-button"
        onClick={() => stepMonth(-1)}
        aria-label="Previous Month"
        title="Previous Month"
      >
        <MatIcon>arrow_back</MatIcon>
      </button>
      <div className="date">
        {formatTimestampMonthYear(displayParams.displayMonth)}
      </div>
      <button
        className="stepper-button"
        aria-label="Next Month"
        title="Next Month"
        onClick={() => stepMonth(1)}
      >
        <MatIcon>arrow_forward</MatIcon>
      </button>
    </div>
  );
};

export default ExpenseMonthSelect;
