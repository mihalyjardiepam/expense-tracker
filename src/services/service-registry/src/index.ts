import "./instrumentation";
import { existsSync } from "fs";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./router";
import { ServiceConfig as Cfg } from "./config";
import { Logger } from "./logger";
import cors from "cors";

if (existsSync(".env")) {
  dotenv.config();
}

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(router);

const server = app.listen(9909, "localhost", async (err) => {
  const fullName = `${Cfg.serviceName}:${Cfg.serviceVersion}`;
  const logger = Logger(fullName);

  if (err) {
    logger.error(`failed to start: ${err}`);
    return process.exit(1);
  }

  const address = server.address();
  if (typeof address == "object") {
    logger.log(
      `listening on ${address.family} http://${address.address}:${address.port}`,
    );
  }
});
