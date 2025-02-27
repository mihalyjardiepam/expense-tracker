import { Request, Response } from "express";
import { Signup } from "../models/signup";
import {
  UpdateUser,
  User,
  UserDto,
  userToDto,
  ValueWithColor,
} from "../models/user";
import crypto, { BinaryLike, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { Currency } from "../models/currency";
import { Login } from "../models/login";
import jwt from "jsonwebtoken";

const scrypt: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer> = promisify(crypto.scrypt);

const signAsync: (
  payload: string | Buffer | object,
  secretOrPrivateKey: jwt.Secret | jwt.PrivateKey,
) => Promise<string> = promisify(jwt.sign);

const ONE_WEEK = 604800;

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

  const salt = crypto.randomBytes(32).toString("hex");
  const hash = await scrypt(password, salt, 64);
  const fullHash = `${salt}.${hash.toString("hex")}`;

  const user = new User({
    categories: [],
    defaultCurrency,
    email,
    name,
    paidTos: [],
    password: fullHash,
    paymentMethods: [],
    registeredAt: new Date().getTime(),
  });

  await user.save();

  res.status(201).send();
}

export async function login(req: Request, res: Response) {
  let { email, password } = req.body as Login;

  const user = await User.findOne({
    email,
  });

  if (user == null) {
    res.status(401).json({
      error: "Invalid username or password",
    });
    return;
  }

  if (!(await comparePassword(password, user.password))) {
    res.status(401).json({
      error: "Invalid username or password",
    });
    return;
  }

  const jwt = await signAsync(
    {
      exp: Math.floor(Date.now() / 1000) + ONE_WEEK * 4,
      issuer: "expense-tracker",
      audience: "expense.localhost",
      sub: user._id.toHexString(),
    },
    process.env.SECRET_KEY,
  );

  res.status(200).json(jwt);
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findOne({
    _id: req.user["id"],
  });

  if (user == null) {
    res.status(401).send("Unauthorized");
    return;
  }

  res.status(200).json(userToDto(user));
}

export async function patchUser(req: Request, res: Response) {
  const body: Partial<UpdateUser> = req.body;
  const update: Record<string, any> = {};

  (<(keyof UpdateUser)[]>["categories", "paidTos", "paymentMethods"]).forEach(
    (key) => {
      if (body[key] && Array.isArray(body[key])) {
        update[key] = body[key];
      }
    },
  );

  if (body.name && typeof body.name === "string") {
    update["name"] = body.name;
  }

  const result = await User.findOneAndUpdate(
    {
      _id: req.user["id"],
    },
    {
      $set: update,
    },
    { returnDocument: "after" },
  );

  res.status(200).json(userToDto(result));
}

export async function comparePassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(".");

  const hashedPasswordBuf = Buffer.from(hash, "hex");

  const passwordBuf = await scrypt(password, salt, 64);

  console.log({ hashedPasswordBuf, passwordBuf });

  if (hashedPasswordBuf.length != passwordBuf.length) {
    return false;
  }

  return timingSafeEqual(hashedPasswordBuf, passwordBuf);
}
