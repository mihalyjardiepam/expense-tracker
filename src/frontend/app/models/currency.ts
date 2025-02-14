/**
 * List of supported currencies.
 */
export enum Currency {
  Eur = "eur",
  Huf = "huf",
  Usd = "usd",
  Php = "php",
}

/**
 * Currency to symbol map.
 */
export const CurrencySymbols: Record<Currency, string> = {
  eur: "€",
  huf: "HUF",
  usd: "$",
  php: "₱",
};

/**
 * Currency to full name map.
 */
export const CurrencyNames: Record<Currency, string> = {
  eur: "Euro",
  huf: "Hungarian Forint",
  php: "Philippine Peso",
  usd: "US Dollar",
};
