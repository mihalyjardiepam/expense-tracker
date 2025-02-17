import { Router } from "express";
import { getService, heartbeat } from "./registry/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.get("/get-service/:name/:version", getService);
router.post("/heartbeat", heartbeat);
