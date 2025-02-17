import { ExchangeRateMap } from "../exchange-rate/service";
import { CurrencyApiResponse } from "../models/currency-api";
import { SUPPORTED_CURRENCIES } from "./supported-currencies";

export function getExchangeRateMap(
  data: CurrencyApiResponse[],
): ExchangeRateMap {
  const map: ExchangeRateMap = new Map();

  let aggregatedCurrencyResponse: Omit<CurrencyApiResponse, "date"> =
    data.reduce((prev, curr) => {
      delete curr.date;
      return {
        ...prev,
        ...curr,
      };
    }, {});

  for (let [key, value] of Object.entries(aggregatedCurrencyResponse)) {
    if (!map.has(key)) {
      map.set(key, new Map());
    }

    for (let currency of SUPPORTED_CURRENCIES) {
      map.get(key).set(currency, value[currency]);
    }
  }

  return map;
}
