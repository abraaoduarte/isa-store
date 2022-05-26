import { Context } from 'koa';
import * as userRepository from 'domains/user/user-repository';
import { wrap } from 'utils/wrap';

export const register = wrap((req: Context) =>
  userRepository.register(req.request).then((user) => ({
    body: {
      message: 'success',
      result: user
    }
  }))
);

export const retrieve = wrap((req: Context) => userRepository.retrieve(req.state.user.id).then((user) => ({
  body: {
    message: 'success',
    result: user
  }
})));
