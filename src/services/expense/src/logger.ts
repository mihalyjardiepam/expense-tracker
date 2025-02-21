export const Logger = (prefix: string) => ({
  log: (message) => {
    console.log(`${prefix} ${message}`);
  },
  error: (message) => {
    console.error(`${prefix} ${message}`);
  },
});
