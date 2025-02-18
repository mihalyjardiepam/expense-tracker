import { Request, Response } from "express";
import { Signup } from "../models/signup";
import { User } from "../models/user";
import crypto, { BinaryLike } from "crypto";
import { promisify } from "util";
import { Currency } from "../models/currency";

const scrypt: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer> = promisify(crypto.scrypt);

export async function signup(req: Request, res: Response) {
  let { name, email, password, defaultCurrency } = req.body as Signup;

  if (!name || !email || !password || !defaultCurrency) {
    res.status(400).json({
      error: "Invalid request: some fields are missing.",
    });
    return;
  }

  const acceptedCurrencies = Object.values(Currency);
  if (!acceptedCurrencies.includes(defaultCurrency)) {
    res.status(400).json({
      error: `Invalid currency: ${defaultCurrency}. Accepted currencies are: ${acceptedCurrencies.join(
        ", ",
      )}`,
    });
  }

  email = email.toLowerCase();

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser != null) {
    res.status(400).json({
      error: "Email address is already in use.",
    });
    return;
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
