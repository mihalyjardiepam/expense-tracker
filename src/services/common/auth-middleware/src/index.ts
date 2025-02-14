import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";

export interface AuthEnv {
  secret: string;
}

export function configure(cfg: AuthEnv) {
  const passportOptions: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
