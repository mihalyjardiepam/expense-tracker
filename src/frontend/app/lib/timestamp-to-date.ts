import type { UnixTimestampMs } from "~/models/unix-timestamp-ms";

export function timestampToDate(timestamp: UnixTimestampMs) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
