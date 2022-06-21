import { Context } from 'koa';
import * as productRepository from 'domains/product/product-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  productRepository.index(req.query).then((products) => ({
    body: {
      message: 'success',
      ...products
    }
  }))
);

export const show = wrap((req: Context) =>
  productRepository.show(req.params.uuid).then((product) => ({
    body: {
      message: 'success',
      result: product
    }
  }))
);

export const create = wrap((req: Context) =>
  productRepository.create(req.request, req.state.user).then((product) => ({
    body: {
      message: 'success',
      result: product
    }
  }))
);

export const update = wrap((req: Context) =>
  productRepository.update(req.request, req.params.uuid, req.state.user).then((product) => ({
    body: {
      message: 'success',
      result: product
    }
  }))
);

export const destroy = wrap((req: Context) =>
  productRepository.destroy(req.params.uuid).then((product) => ({
    body: {
      message: 'success',
      result: product
    }
  }))
);
