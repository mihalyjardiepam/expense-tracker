import { sleep } from "~/lib/sleep";

export class LocalStorageService<T> {
  constructor(
    private localStorageKey: string,
    defaultValue: T,
    private latencySimulation: boolean = true,
  ) {
    if (localStorage.getItem(localStorageKey) === null) {
      this.setStorage(defaultValue);
    }
  }

  protected async setStorage(items: T): Promise<void> {
    this.latencySimulation && (await sleep(300));
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
  }

  protected async getStorage(): Promise<T> {
    this.latencySimulation && (await sleep(300));
    return JSON.parse(localStorage.getItem(this.localStorageKey) || "");
  }
}
