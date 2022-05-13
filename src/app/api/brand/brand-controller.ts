import { Context } from 'koa';
import * as brandRepository from 'domains/brand/brand-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  brandRepository.index(req.query).then((brands) => ({
    body: {
      message: 'success',
      ...brands
    }
  }))
);

export const show = wrap((req: Context) =>
  brandRepository.show(req.params.uuid).then((brand) => ({
    body: {
      message: 'success',
      result: brand
    }
  }))
);

export const create = wrap((req: Context) =>
  brandRepository.create(req.request).then((brand) => ({
    body: {
      message: 'success',
      result: brand
    }
  }))
);

export const update = wrap((req: Context) =>
  brandRepository.update(req.request, req.params.uuid).then((brand) => ({
    body: {
      message: 'success',
      result: brand
    }
  }))
);

export const destroy = wrap((req: Context) =>
  brandRepository.destroy(req.params.uuid).then((brand) => ({
    body: {
      message: 'success',
      result: brand
    }
  }))
);
