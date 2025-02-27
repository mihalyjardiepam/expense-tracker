import passport from "passport";
import { Router } from "express";
import { getUser, login, patchUser, signup } from "./auth/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.post("/signup", signup);
router.post("/login", login);

router.use("/user", passport.authenticate("jwt", { session: false }));
router.get("/user", getUser);
router.patch("/user", patchUser);
