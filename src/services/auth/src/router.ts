import { Router } from "express";
import { signup } from "./auth/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.post("/signup", signup);
