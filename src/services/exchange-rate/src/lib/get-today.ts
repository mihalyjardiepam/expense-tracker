// Returns the current date in yyy-MM-dd format.
export function getToday() {
  const today = new Date();

  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}
