import { AnyObjectSchema } from 'yup';
import { RouterContext } from '@koa/router';
import { Next } from 'koa';
import { handleError } from './handle-error';

const isEmptyObject = (value: string) => Object.keys(value || {}).length === 0;

type Options = {
  canBeEmpty: boolean;
};

export const validate =
  (
    schema: AnyObjectSchema,
    { query = false, body = false, params = false } = {},
    { canBeEmpty = true } = {},
  ) =>
  async (context: RouterContext, next: Next) => {
    const data = {
      ...(query && context.request.query),
      ...(body && context.request.body),
      ...(params && context.params),
    };

    if (!canBeEmpty && isEmptyObject(data)) {
      throw new Error('This request cannot be empty.');
    }

    await schema
      .validate(data, { abortEarly: false })
      .then(() => {
        return next();
      })
      .catch((error) => {
        handleError(context, error);
      });
  };

validate.body = (schema: AnyObjectSchema, options?: Options) =>
  validate(schema, { body: true, query: false }, options);
validate.data = (schema: AnyObjectSchema, options?: Options) =>
  validate(schema, { body: true, query: true }, options);
validate.params = (schema: AnyObjectSchema, options?: Options) =>
  validate(schema, { params: true }, options);
validate.all = (schema: AnyObjectSchema, options?: Options) =>
  validate(schema, { body: true, query: true, params: true }, options);
