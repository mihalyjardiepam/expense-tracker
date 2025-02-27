import type { UnixTimestampMs } from "./unix-timestamp-ms";

export interface DateRange {
  from: UnixTimestampMs;
  to: UnixTimestampMs;
}

/**
 * Returns a `DateRange` from a year and a month.
 * @param year Full year
 * @param month 0 indexed month (January = 0, December = 11)
 * @returns the DateRange for the associated month
 */
export function getRangeFromMonth(year: number, month: number): DateRange {
  const startOfMonth = new Date(year, month);
  const endOfMonth = new Date(year, month + 1);

  return {
    from: startOfMonth.getTime(),
    to: endOfMonth.getTime(),
  };
}
