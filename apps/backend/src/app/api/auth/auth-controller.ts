import { Context } from 'koa';
import * as authRepository from 'domains/auth/auth-repository';
import { wrap } from 'utils/wrap';

export const login = wrap((req: Context) =>
  authRepository.login(req.request).then((user) => ({
    body: {
      message: 'success',
      result: user
    }
  }))
);

export const refresh = wrap((req: Context) =>
  authRepository.refresh(req.request).then((user) => ({
    body: {
      message: 'success',
      result: user
    }
  }))
);
