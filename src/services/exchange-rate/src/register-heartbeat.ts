import { Logger } from "./logger";
import crypto from "crypto";

export interface HeartbeatConfig {
  serviceRegistryUri: string;
  serviceName: string;
  serviceVersion: string;
  serviceSecret: string;
  port: string;
}

export function registerHeartbeat(config: HeartbeatConfig): NodeJS.Timeout {
  heartbeat(config);
  return setInterval(() => heartbeat(config), 5_000);
}

async function heartbeat(config: HeartbeatConfig) {
  const logger = Logger(`[${config.serviceName}] heartbeat`);

  const heartbeatRequest = {
    name: config.serviceName,
    version: config.serviceVersion,
    port: config.port,
    check: getChecksum(config.serviceName, config.port, config.serviceSecret),
  };

  logger.log("Sending heartbeat request.");

  try {
    const response = await fetch(config.serviceRegistryUri, {
      method: "POST",
      body: JSON.stringify(heartbeatRequest),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      logger.log("Successfully sent heartbeat request.");
    } else {
      logger.error("Failed to send heartbeat request.");
      logger.error(await response.text());
    }
  } catch (error) {
    console.error("Failed to register service: ", error);
  }
}

export function getChecksum(
  name: string,
  port: string,
  secret: string,
): string {
  const serviceKey = `${name}-${port}`;

  return crypto.createHmac("sha256", secret).update(serviceKey).digest("hex");
}
