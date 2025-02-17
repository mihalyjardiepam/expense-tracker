import { Currency } from "./currency";

export interface Signup {
  name: string;
  email: string;
  password: string;
  defaultCurrency: Currency;
}
