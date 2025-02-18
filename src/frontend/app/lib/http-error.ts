export class HttpError extends Error {
  constructor(public statusCode: number, public error: string) {
    super(`HttpError: request failed with ${statusCode}. Error: ${error}`);
  }
}
