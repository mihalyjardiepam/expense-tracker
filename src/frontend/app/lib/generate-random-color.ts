export type HexColor = string;

const RED_LUMINANCE = 0.299;
const GREEN_LUMINANCE = 0.587;

/**
 * Generates a pseudorandom color code with a capped luminance value.
 * @returns A random hex color code.
 */
export function generateRandomColor(): HexColor {
  let lum = 50;

  const r = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));
  lum += r * RED_LUMINANCE;
  const g = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));
  lum += g * GREEN_LUMINANCE;
  let b = Math.floor(Math.max(20, Math.random() * 155 + 50 - lum));

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(number: number): string {
  return number.toString(16).padStart(2, "0");
}
