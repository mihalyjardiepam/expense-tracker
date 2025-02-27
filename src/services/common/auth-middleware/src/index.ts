import { Request } from "express";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
  ExtractJwt,
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

export function configure(passport: passport.PassportStatic, cfg: AuthEnv) {
  const passportOptions: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.secret,
  };

  passport.use(
    "jwt",
    new JwtStrategy(passportOptions, (payload, done) => {
      console.log({ payload });

      done(null, { id: payload.sub });
    }),
  );
}
