import { getExchangeRateMap } from "../lib/get-exchange-rate-map";
import { getTodayFmt } from "../lib/get-today-fmt";
import { SUPPORTED_CURRENCIES } from "../lib/supported-currencies";
import { CurrencyApiResponse } from "../models/currency-api";
import { ExchangeRate } from "../models/exchange-rate";

export interface ExchangeService {
  getExchangeRate(from: string, to: string): Promise<number>;
}

export type ExchangeRateMap = Map<string, Map<string, number>>;

export class ExchangeApiService implements ExchangeService {
  #memCache: Map<string, ExchangeRateMap> = new Map();

  /**
   * Used for "locking" the getExchangeRate method so there is only 1
   * simultaneous fetch. This is to avoid duplicate exchange rate data in the
   * DB.
   *
   * **NOTE: This is not a good solution.**
   *
   * A better solution would be to not allow the service to retrieve exchange
   * rate data and instead have it throw an error if the exchange rate does
   * not exist.
   * Another process or service should handle the data fetch and inserts to DB,
   * preferably when the data source gets updated with the new exchange rates.
   */
  #resolveExchangeRate: Promise<ExchangeRateMap> | undefined = undefined;

  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from == to) {
      return 1;
    }

    const today = getTodayFmt();

    if (this.#memCache[today]?.get(from)?.get(to) != undefined) {
      return this.#memCache[today].get(from).get(to);
    }

    // locking the process
    if (this.#resolveExchangeRate == undefined) {
      this.#resolveExchangeRate = this.#getExchangeRates(today);
    }

    const map = await this.#resolveExchangeRate;

    // unlocking
    this.#resolveExchangeRate = undefined;

    this.#memCache.set(today, map);

    console.log({ map });

    return map.get(from).get(to);
  }

  async #getExchangeRates(date: string): Promise<ExchangeRateMap> {
    const exchangeRate = await ExchangeRate.findOne({
      date,
    });

    let exchangeRateMap: ExchangeRateMap;

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

      let map = getExchangeRateMap(dataArray);

      const exchangeRate = new ExchangeRate({
        date,
        exchangeRateMap: map,
      });
      await exchangeRate.save();

      exchangeRateMap = map;
    } else {
      exchangeRateMap = exchangeRate.exchangeRateMap as ExchangeRateMap;
    }

    return exchangeRateMap;
  }
}

export const ExchangeRateService: ExchangeService = new ExchangeApiService();
