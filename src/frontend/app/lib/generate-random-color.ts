export type HexColor = string;

/**
 * Generates a pseudorandom color code with a capped luminance value.
 * @returns A random hex color code.
 */
export function generateRandomColor(): HexColor {
  let lum = 50;

  const r = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));
  lum += r * 0.299;
  const g = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));
  lum += g * 0.587;
  let b = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(number: number): string {
  console.log(number);

  return number.toString(16).padStart(2, "0");
}
