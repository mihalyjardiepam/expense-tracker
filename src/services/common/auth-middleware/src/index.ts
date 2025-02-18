import { Request } from "express";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";

export interface AuthEnv {
  secret: string;
}

function cookieExtractor(req: Request) {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["expense-session"];
  }

  return token;
}

export function configure(cfg: AuthEnv) {
  const passportOptions: StrategyOptionsWithoutRequest = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: cfg.secret,
    issuer: "expense-tracker",
    audience: "expense.localhost",
  };

  passport.use(
    new JwtStrategy(passportOptions, (payload, done) => {
      done(null, { id: payload.sub });
    }),
  );
}
