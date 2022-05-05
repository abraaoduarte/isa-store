import passport from 'koa-passport';
import { Strategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import env from 'utils/env';
import { findUserByUuid } from 'domains/user/user-repository';
import { PayloadLoginProps } from 'interfaces';
import { omit } from 'ramda';

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env('APP_SECRET')
};

const strategyHandler = (payload: PayloadLoginProps, done: VerifyCallback) => {
  const { user } = payload.data;

  return findUserByUuid(user)
    .then((user) => done(null, omit(['password'], user) as any))
    .catch(() => done);
};

const AppStrategy = new Strategy(params, strategyHandler);

passport.use('api-jwt', AppStrategy);

const locker = {
  api: (options = {}) =>
    passport.authenticate('api-jwt', {
      session: false,
      failWithError: true,
      ...options
    })
};

export { locker };
