/**
 *
 * @returns the current date in `yyyy-MM-dd` format.
 */
export function getTodayFmt() {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
