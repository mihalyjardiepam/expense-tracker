import passport from "passport";
import { Router } from "express";
import { getUser, login, signup } from "./auth/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/get-user",
  passport.authenticate("jwt", { session: false }),
  getUser,
);
