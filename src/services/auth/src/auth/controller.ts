import { Request, Response } from "express";
import { Signup } from "../models/signup";
import { User } from "../models/user";
import crypto, { BinaryLike } from "crypto";
import { promisify } from "util";

const scrypt: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer> = promisify(crypto.scrypt);

export async function signup(req: Request, res: Response) {
  const { name, email, password, defaultCurrency } = req.body as Signup;

  if (!name || !email || !password || !defaultCurrency) {
    return res.status(400).json({
      error: "Missing fields.",
    });
  }

  const hash = await scrypt(password, crypto.randomBytes(32), 64);

  const user = new User({
    categories: [],
    defaultCurrency,
    email,
    name,
    paidTos: [],
    password: hash.toString("hex"),
    paymentMethods: [],
    registeredAt: new Date().getTime(),
  });

  await user.save();

  res.status(201).send();
}
