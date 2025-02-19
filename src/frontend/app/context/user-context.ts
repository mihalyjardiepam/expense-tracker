import { createContext } from "react";
import type { User } from "~/models/user";

export const UserContext = createContext<User | null>(null);
