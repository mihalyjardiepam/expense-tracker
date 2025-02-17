import { Request, Response } from "express";
import { ServiceContainer } from "./service-container";

const container = new ServiceContainer();

export function getService(req: Request, res: Response) {
  const { name, version } = req.params;
  try {
    const service = container.getService(name, version);

    res.json({
      uri: service.uri,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export function heartbeat(req: Request, res: Response) {
  const { check, name, port, version } = req.body;

  try {
    container.heartbeat(
      {
        check,
        name,
        port,
        version,
      },
      req.ip,
    );

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}
