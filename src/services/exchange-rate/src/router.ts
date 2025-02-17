import { Router } from "express";
import { getExchangeRate } from "./exchange-rate/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.get("/exchange-rate/:from/:to", getExchangeRate);
