import { getExchangeRateMatrix } from "../lib/get-exchange-rate-matrix";
import { getToday } from "../lib/get-today";
import { SUPPORTED_CURRENCIES } from "../lib/supported-currencies";
import { CurrencyApiResponse } from "../models/currency-api";
import { ExchangeRate } from "../models/exchange-rate";

export interface ExchangeService {
  getExchangeRate(from: string, to: string): Promise<number>;
}

export type ExchangeRateMatrix = Map<string, Map<string, number>>;

export class ExchangeApiService implements ExchangeService {
  #cache: Map<string, ExchangeRateMatrix> = new Map();
  #resolveExchangeRate: Promise<ExchangeRateMatrix> | undefined = undefined;

  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from == to) {
      return 1;
    }

    const today = getToday();

    if (this.#cache[today]?.[from]?.[to] != undefined) {
      return this.#cache[today][from][to];
    }

    if (this.#resolveExchangeRate == undefined) {
      this.#resolveExchangeRate = this.#getExchangeRates(today);
    }

    const matrix = await this.#resolveExchangeRate;

    this.#cache.set(today, matrix);

    return matrix[from][to];
  }

  async #getExchangeRates(date: string): Promise<ExchangeRateMatrix> {
    const exchangeRate = await ExchangeRate.findOne({
      date,
    });

    let exchangeRateMatrix: ExchangeRateMatrix;

    if (exchangeRate == undefined) {
      const promises = SUPPORTED_CURRENCIES.map((currency) =>
        fetch(
          `https://${date}.currency-api.pages.dev/v1/currencies/${currency}.json`,
        ),
      );

      const responses = await Promise.all(promises);
      const dataArray: CurrencyApiResponse[] = await Promise.all(
        responses.map((response) => response.json()),
      );

      let matrix = getExchangeRateMatrix(dataArray);

      const exchangeRate = new ExchangeRate({
        date,
        currencyMatrix: matrix,
      });
      await exchangeRate.save();

      exchangeRateMatrix = matrix;
    } else {
      exchangeRateMatrix = exchangeRate.currencyMatrix as ExchangeRateMatrix;
    }

    return exchangeRateMatrix;
  }
}
