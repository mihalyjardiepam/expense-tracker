import { Request, Response } from "express";
import { ExchangeRateService } from "./service";

export async function getExchangeRate(req: Request, res: Response) {
  const { from, to } = req.params;

  const exchangeRate = await ExchangeRateService.getExchangeRate(from, to);

  res.json({
    exchangeRate,
  });
}
