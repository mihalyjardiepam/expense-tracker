import { CurrencyApiResponse } from "../models/currency-api";
import { getExchangeRateMap } from "./get-exchange-rate-map";

describe("", () => {
  it("converts exchanges rates into a map from an array", () => {
    const data: CurrencyApiResponse[] = [
      {
        date: "2025-01-01",
        eur: {
          eur: 1,
          huf: 401.81,
          usd: 1.05,
          php: 60.63,
        },
      },
      {
        date: "2025-01-01",
        huf: {
          eur: 0.0025,
          huf: 1,
          usd: 0.0026,
          php: 0.15,
        },
      },
      {
        date: "2025-01-01",
        usd: {
          eur: 0.95,
          huf: 382.34,
          usd: 1,
          php: 57.71,
        },
      },
      {
        date: "2025-01-01",
        php: {
          eur: 0.02,
          huf: 6.62,
          usd: 0.02,
          php: 1,
        },
      },
    ];

    const map = getExchangeRateMap(data);

    expect(map.get("eur").get("huf")).toEqual(401.81);
    expect(map.get("usd").get("huf")).toEqual(382.34);
    expect(map.get("php").get("php")).toEqual(1);
    expect(map.get("php").get("huf")).toEqual(6.62);
  });
});
