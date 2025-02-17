import "./instrumentation";
import { existsSync } from "fs";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./router";
import { ServiceConfig as Cfg } from "./config";
import { Logger } from "./logger";
import mongoose from "mongoose";
import { configure as configureAuthMiddleware } from "expense-app-auth-middleware";
import { registerHeartbeat } from "./register-heartbeat";

if (existsSync(".env")) {
  dotenv.config();
}

const SERVICE_REGISTRY_URI =
  process.env.SERVICE_REGISTRY_URI || "http://localhost:9909/heartbeat";

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(router);

const server = app.listen(0, "localhost", async (err) => {
  const fullName = `${Cfg.serviceName}:${Cfg.serviceVersion}`;
  const logger = Logger(fullName);

  configureAuthMiddleware({
    secret: process.env.SECRET_KEY,
  });

  if (err) {
    logger.error(`failed to start: ${err}`);
    return process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    logger.log("MongoDB connected");
  } catch (error) {
    logger.error(`failed to connect to MongoDB: ${error}`);
    process.exit(2);
  }

  const address = server.address();
  if (typeof address == "object") {
    logger.log(
      `listening on ${address.family} http://${address.address}:${address.port}`,
    );

    registerHeartbeat({
      port: address.port.toString(),
      serviceName: Cfg.serviceName,
      serviceRegistryUri: SERVICE_REGISTRY_URI,
      serviceSecret: process.env.SERVICE_SECRET,
      serviceVersion: Cfg.serviceVersion,
    });
  }
});
