import type { Fetch } from "~/types/fetch";

export const AUTH_TOKEN_LOCALSTORAGE_KEY = "__ext_auth_token";

export function useAuthentication(fetchFn: Fetch = fetch) {
  const authFetch = async (input: string | URL, init?: RequestInit) => {
    return await fetchFn(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...getAuthHeader(),
      },
    });
  };

  return authFetch as Fetch;
}

function getAuthHeader(): HeadersInit {
  const header: HeadersInit = {};

  const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

  if (token != null) {
    header["Authorization"] = `Bearer ${token}`;
  }

  return header;
}
