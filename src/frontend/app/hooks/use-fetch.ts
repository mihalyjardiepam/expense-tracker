import { environment } from "~/environment";
import { HttpError } from "~/lib/http-error";

const SERVICE_REGISTRY: Record<string, string> = {};

export function useFetch(service: string) {
  const apiFetch = async (input: string | URL, init?: RequestInit) => {
    let doResolve = false;
    if (SERVICE_REGISTRY[service]) {
      try {
        await testService(SERVICE_REGISTRY[service]);
      } catch (error) {
        doResolve = true;
      }
    } else {
      doResolve = true;
    }

    if (doResolve) {
      SERVICE_REGISTRY[service] = await resolveService(service);
    }

    return await fetch(`${SERVICE_REGISTRY[service]}${input}`, init);
  };

  return [apiFetch];
}

async function testService(uri: string): Promise<boolean | never> {
  return (await fetch(uri)).ok;
}

async function resolveService(service: string): Promise<string> {
  const serviceVersion = environment.serviceVersions[service];

  if (!serviceVersion) {
    throw new Error("Unknown service: " + service);
  }

  const response = await fetch(
    `${environment.serviceRegistryUrl}/get-service/${service}/${serviceVersion}`,
  );

  if (response.ok) {
    const data = await response.json();
    return data.uri;
  } else {
    throw new HttpError(response.status, await response.text());
  }
}
