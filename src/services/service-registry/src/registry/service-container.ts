import semver from "semver";
import { getChecksum } from "../register-heartbeat";
import { Logger } from "../logger";

interface ServiceEntry {
  serviceName: string;
  version: string;
  uri: string;
  registeredAt: number;
}

export interface HeartbeatRequest {
  name: string;
  version: string;
  port: string;
  check: string;
}

const SERVICE_EXPIRY_MS = 30_000;

export class ServiceContainer {
  #services = new Map<string, ServiceEntry[]>();
  #logger = Logger("[heartbeat]");

  heartbeat(request: HeartbeatRequest, clientAddr: string) {
    if (!this.#services.has(request.name)) {
      this.#services.set(request.name, []);
    }

    if (
      request.check !==
      getChecksum(request.name, request.port, process.env.SERVICE_SECRET)
    ) {
      throw new Error("Failed to verify service identity.");
    }

    const serviceUri = `http://${clientAddr}:${request.port}`;

    const services = this.#services.get(request.name);

    let serviceIndex = services.findIndex((s) => s.uri == serviceUri);

    if (serviceIndex == -1) {
      services.push({
        registeredAt: new Date().getTime(),
        serviceName: request.name,
        uri: serviceUri,
        version: request.version,
      });

      this.#logger.log(
        `[register] ${request.name} ${request.version} ${serviceUri}`,
      );
    } else {
      services[serviceIndex].registeredAt = new Date().getTime();

      this.#logger.log(
        `[update] ${request.name} ${request.version} ${serviceUri}`,
      );
    }

    this.#services.set(request.name, services);
    this.#cleanupServices(request.name);
  }

  getService(name: string, requestVersion: string): ServiceEntry | never {
    if (!this.#services.has(name)) {
      throw new Error(`Failed to resolve service ${name}: no such service.`);
    }

    this.#cleanupServices(name);

    const services = this.#services
      .get(name)
      .filter((service) => semver.satisfies(service.version, requestVersion));

    if (services.length == 0) {
      throw new Error(
        `Failed to resolve service ${name}: version constrain not satisfied: ${requestVersion}.`,
      );
    }

    const randIndex = Math.floor(services.length * Math.random());

    return services[randIndex];
  }

  #cleanupServices(key: string) {
    const expiry = new Date().getTime() - SERVICE_EXPIRY_MS;

    if (this.#services.has(key)) {
      const services = this.#services
        .get(key)
        .filter((service) => service.registeredAt >= expiry);

      this.#services.set(key, services);
    }
  }
}
