export function roundTo(value: number, digits: number) {
  let pow = Math.pow(10, digits);
  return Math.round(value * pow) / pow;
}
