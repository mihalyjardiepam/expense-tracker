import { Router } from "express";
import passport from "passport";
import { create, del, query, update } from "./expense/controller";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.use("/expenses", passport.authenticate("jwt", { session: false }));
router.get("/expenses", query);
router.post("/expenses", create);
router.put("/expenses/:id", update);
router.delete("/expenses/:id", del);
