import React, {
  useCallback,
  useContext,
  useState,
  useTransition,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import FormField from "../form-field/FormField";
import "./ExpenseForm.scss";
import { UserContext } from "~/context/user-context";
import { Currency, CurrencyNames } from "~/models/currency";
import { useFetch } from "~/hooks/use-fetch";
import { roundTo } from "~/lib/round-to";
import MatIcon from "../mat-icon/MatIcon";
import { useCachedSetting } from "~/hooks/use-cached-setting";

const LOCALSTORAGE_SYNC_SETTING_DEFAULT = "__exp_syncSettingDefaultKey";

const ExpenseForm = () => {
  const [isPending, startTransition] = useTransition();
  const [erFetch] = useFetch("exchange-rate");
  const [expenseFetch] = useFetch("expense");

  const user = useContext(UserContext);
  const [currency, setCurrency] = useState(() => user!.defaultCurrency);

  // This variable is needed to determine which input needs updating in case
  // the exchange rate is updated.
  // For example, if the paymentAmount is entered, then the exchangeRate
  // is updated, the exchangedAmount needs to be updated.
  const [lastChangedInput, setLastChangedInput] = useState("paymentAmount");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [syncPaymentAmounts, setSyncPaymentAmounts] = useCachedSetting(
    LOCALSTORAGE_SYNC_SETTING_DEFAULT,
    true,
  );
  const [exchangedAmount, setExchangedAmount] = useState(0);

  const currencyChanged = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const value = evt.target.value as Currency;

      if (value === user!.defaultCurrency) {
        setExchangeRate(1);
      } else {
        startTransition(async () => {
          const response = await erFetch(
            `/exchange-rate/${value}/${user!.defaultCurrency}`,
            {
              credentials: "include",
            },
          );

          if (response.ok) {
            const data = await response.json();
            const exchangeRate = data.exchangeRate as number;
            setExchangeRate(roundTo(data.exchangeRate, 2));
            setExchangedAmount(roundTo(paymentAmount * exchangeRate, 2));
          }
        });
      }

      setCurrency(value);
    },
    [setCurrency, startTransition],
  );

  const paymentAmountChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let amount = Number(e.target.value);
      setPaymentAmount(amount);
      setLastChangedInput("paymentAmount");

      if (syncPaymentAmounts) {
        setExchangedAmount(roundTo(amount * exchangeRate, 2));
      }
    },
    [syncPaymentAmounts, exchangeRate],
  );

  const exchangeRateChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let amount = Number(e.target.value);

      setExchangeRate(amount);

      if (syncPaymentAmounts) {
        if (lastChangedInput == "paymentAmount") {
          setExchangedAmount(roundTo(paymentAmount * amount, 2));
        } else {
          setPaymentAmount(roundTo(exchangedAmount / amount, 2));
        }
      }
    },
    [syncPaymentAmounts, paymentAmount, exchangedAmount],
  );

  const exchangedAmountChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let amount = Number(e.target.value);
      setExchangedAmount(amount);
      setLastChangedInput("exchangedAmount");

      if (syncPaymentAmounts) {
        setPaymentAmount(roundTo(amount / exchangeRate, 2));
      }
    },
    [syncPaymentAmounts, exchangeRate],
  );

  const toggleAmountSync = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setSyncPaymentAmounts(!syncPaymentAmounts);

      localStorage.setItem(
        LOCALSTORAGE_SYNC_SETTING_DEFAULT,
        JSON.stringify(!syncPaymentAmounts),
      );
    },
    [syncPaymentAmounts],
  );

  const submitExpense = useCallback(() => {}, [expenseFetch]);

  return (
    <form className="expense-form" onSubmit={submitExpense}>
      <h2>Add Expense</h2>
      <FormField label="Date" hint="MM/DD/YYYY">
        <input disabled={isPending} type="date" name="date" required />
      </FormField>
      <FormField label="Payment Method" hint="card, cash, etc.">
        <input
          disabled={isPending}
          type="text"
          name="paymentMethod"
          list="paymentMethods"
        />
        <datalist id="paymentMethods">
          {user!.paymentMethods.map((paymentMethod) => (
            <option value={paymentMethod.value} key={paymentMethod.value}>
              {paymentMethod.value}
            </option>
          ))}
        </datalist>
      </FormField>
      <FormField label="Payment To" hint="grocery store">
        <input disabled={isPending} type="text" name="paidTo" list="paidTos" />
        <datalist id="paidTos">
          {user!.paidTos.map((paidTo) => (
            <option value={paidTo.value} key={paidTo.value}>
              {paidTo.value}
            </option>
          ))}
        </datalist>
      </FormField>
      <FormField label="Notes">
        <input disabled={isPending} type="text" name="notes" />
      </FormField>
      <FormField label="Category" hint="groceries, bills, etc.">
        <input
          disabled={isPending}
          type="text"
          name="category"
          list="categories"
        />
        <datalist id="categories">
          {user!.categories.map((category) => (
            <option value={category.value} key={category.value}>
              {category.value}
            </option>
          ))}
        </datalist>
      </FormField>
      <FormField label="Payment Currency">
        <select
          disabled={isPending}
          name="currency"
          value={currency}
          onChange={currencyChanged}
        >
          {Object.entries(Currency).map(([key, value]) => (
            <option key={key} value={value}>
              {CurrencyNames[value]}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        label={`Payment Amount ${currency.toUpperCase()}`}
        hint="35.41"
      >
        <input
          disabled={isPending}
          type="number"
          required
          step="0.01"
          name="paymentAmount"
          value={paymentAmount}
          onChange={paymentAmountChanged}
        />
      </FormField>
      {currency != user?.defaultCurrency && (
        <>
          <span>Converting to: {user!.defaultCurrency.toUpperCase()}</span>
          <div className="exchange-rate-field">
            <button
              className={`lock-rate-button ${
                syncPaymentAmounts ? "active" : ""
              }`}
              onClick={toggleAmountSync}
              aria-description="Automatically synchronize payment amounts"
              title="Automatically synchronize payment amounts"
              aria-pressed={syncPaymentAmounts}
            >
              <MatIcon>{syncPaymentAmounts ? "sync_lock" : "sync"}</MatIcon>
            </button>
            <FormField label="Exchange Rate">
              <input
                disabled={isPending}
                type="number"
                step="0.01"
                required
                name="exchangeRate"
                value={exchangeRate}
                onChange={exchangeRateChanged}
              />
            </FormField>
          </div>
          <FormField
            label={`Exchanged Amount ${user!.defaultCurrency.toUpperCase()}`}
          >
            <input
              type="number"
              step="0.01"
              required
              name="exchangedAmount"
              value={exchangedAmount}
              onChange={exchangedAmountChanged}
            />
          </FormField>
        </>
      )}
      <div className="button-area">
        <button className="app-btn color-primary variant-fill">
          Save Expense
        </button>
        <button className="app-btn color-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default React.memo(ExpenseForm);
