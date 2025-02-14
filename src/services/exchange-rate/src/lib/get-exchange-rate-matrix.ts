import { ExchangeRateMatrix } from "../currency/service";
import { CurrencyApiResponse } from "../models/currency-api";
import { SUPPORTED_CURRENCIES } from "./supported-currencies";

export function getExchangeRateMatrix(
  data: CurrencyApiResponse[],
): ExchangeRateMatrix {
  const matrix: ExchangeRateMatrix = new Map();

  let aggregatedCurrencyResponse: Omit<CurrencyApiResponse, "date"> =
    data.reduce((prev, curr) => {
      delete curr.date;
      return {
        ...prev,
        ...curr,
      };
    }, {});

  for (let [key, value] of Object.entries(aggregatedCurrencyResponse)) {
    if (!matrix.has(key)) {
      matrix.set(key, new Map());
    }

    for (let currency of SUPPORTED_CURRENCIES) {
      matrix.get(key).set(currency, value[currency]);
    }
  }

  return matrix;
}
