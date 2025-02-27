import type { UnixTimestampMs } from "~/models/unix-timestamp-ms";

export function formatTimestampYYYYMMDD(timestamp: UnixTimestampMs): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTimestampMonthYear(timestamp: UnixTimestampMs): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString("default", { month: "long", year: "numeric" });
}
