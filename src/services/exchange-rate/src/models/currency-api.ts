export interface CurrencyApiResponse {
  /**
   * Date in yyyy-MM-dd format
   */
  date: string;
  eur?: Record<string, number>;
  usd?: Record<string, number>;
  huf?: Record<string, number>;
  php?: Record<string, number>;
}
