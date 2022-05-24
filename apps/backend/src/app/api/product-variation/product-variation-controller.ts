import { Context } from 'koa';
import * as productVariationRepository from 'domains/product-variation/product-variation-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  productVariationRepository.index(req.query).then((productVariations) => ({
    body: {
      message: 'success',
      ...productVariations
    }
  }))
);

export const show = wrap((req: Context) =>
  productVariationRepository.show(req.params.uuid).then((productVariation) => ({
    body: {
      message: 'success',
      result: productVariation
    }
  }))
);

export const create = wrap((req: Context) =>
  productVariationRepository.create(req.request).then((productVariation) => ({
    body: {
      message: 'success',
      result: productVariation
    }
  }))
);

export const update = wrap((req: Context) =>
  productVariationRepository.update(req.request, req.params.uuid).then((productVariation) => ({
    body: {
      message: 'success',
      result: productVariation
    }
  }))
);

export const destroy = wrap((req: Context) =>
  productVariationRepository.destroy(req.params.uuid).then((productVariation) => ({
    body: {
      message: 'success',
      result: productVariation
    }
  }))
);
