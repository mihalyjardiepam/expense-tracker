/**
 * Checks if the date is a truthy value and determines whether it's a valid
 * date by checking `getTime`.
 * @param date input
 * @returns if the date is a valid date
 */
export function isValidDate(date: Date) {
  return !!date && !isNaN(date.getTime());
}
