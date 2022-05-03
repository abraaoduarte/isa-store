import { makeResponseHandler } from 'utils/make-response-handler';
import logger from 'utils/logger';
import { BadRequest, NotFound } from 'app/error';
import { Context } from 'koa';
import { ValidationError } from 'yup';

type CustomError = ValidationError & BadRequest & NotFound;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (ctx: Context, error: CustomError) => {
  const handler = makeResponseHandler(ctx);
  logger.error(error);

  if (error.response) {
    logger.error(`HANDLED_ERROR: ${error.response().body.name}`);
    return handler(error.response());
  }

  console.log('não aqui por favor');
  if (error.name === 'ValidationError' && error.value) {
    logger.error('HANDLED_ERROR:', error.name);
    return handler({
      status: 400,
      body: {
        message: `Ocorreram ${error.errors.length} erros de validação. Corrija-os e tente novamente.`,
        detail: {
          errors: error.inner,
          messages: error.errors,
        },
      },
    });
  }

  logger.error(`UNHANDLED_ERROR: ${error.name}`);
  return handler({
    status: 500,
    body: {
      detail: {
        name: error.name,
        message: error.message,
      },
    },
  });
};

export { handleError };
