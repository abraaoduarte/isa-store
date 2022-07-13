import { Context } from 'koa';
import * as productVariationRepository from 'domains/product-variation/product-variation-repository';
import { wrap } from 'utils/wrap';

export const destroy = wrap((req: Context) =>
  productVariationRepository.destroy(req.params.uuid).then((productVariation) => ({
    body: {
      message: 'success',
      result: productVariation
    }
  }))
);
