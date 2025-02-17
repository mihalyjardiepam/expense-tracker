const START_CHAR_CODE = "a".charCodeAt(0);
const ALPHABET_LENGTH = 26;
const DEFAULT_ID_LENGTH = 12;

/**
 * Generates a pseudorandom ID.
 * @param length How many characters the ID should consist of
 * @returns the ID
 */
export function generateId(length: number = DEFAULT_ID_LENGTH): string {
  let codes: number[] = [];

  for (let i = 0; i < length; i++) {
    codes.push(START_CHAR_CODE + Math.floor(Math.random() * ALPHABET_LENGTH));
  }

  return String.fromCharCode(...codes);
}
