import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema({
  /**
   * Date representation in YYYY-MM-DD format.
   *
   * This format is used by the API we retrieve the exchange rate data from.
   */
  date: String,
  exchangeRateMap: {
    type: Map,
    of: {
      type: Map,
      of: Number,
    },
  },
});

export const ExchangeRate = mongoose.model("ExchangeRate", exchangeRateSchema);
