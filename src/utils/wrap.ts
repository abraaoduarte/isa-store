import { Context } from 'koa';
import { ResponseRequestProp } from 'interfaces';
import { makeResponseHandler } from './make-response-handler';
import { handleError } from 'app/middlewares/handle-error';

type Fn = (context: Context) => Promise<ResponseRequestProp>;

const wrap =
  (fn: Fn) =>
    async (context: Context) => {
      return fn(context)
        .then(makeResponseHandler(context))
        .catch((error) => {
          handleError(context, error);
        });
    };

export { wrap };
