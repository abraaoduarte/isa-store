import { Context } from 'koa';

const makeResponseHandler =
  (context: Context) => {
    return ({ status = 200, headers = {}, body = {} }) => {
      context.set(headers);
      context.status = status;
      context.body = body;
    };
  };

export { makeResponseHandler };
