import type { Currency } from "./currency";

/**
 * Details of payment.
 */
export interface Payment {
  /**
   * Currency the payment was made in.
   */
  currency: Currency;

  /**
   * Amount paid in the currency.
   */
  amount: number;

  /**
   * Converted currency.
   * In case if the user makes their payment in their local currency the
   * `convertedTo` and the `convertedAmount` will be the same as the currency
   * and amount properties.
   */
  convertedTo: Currency;

  /**
   * Amount paid in the converted currency.
   */
  convertedAmount: number;

  /**
   * The exchange rate used to convert the two currencies.
   * In the case when the currency and the convertTo are the same, this will be
   * set to 1.
   */
  exchangeRate: number;
}
