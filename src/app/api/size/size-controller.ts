import { Context } from 'koa';
import * as sizeRepository from 'domains/size/size-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  sizeRepository.index(req.query).then((sizes) => ({
    body: {
      message: 'success',
      ...sizes
    }
  }))
);

export const show = wrap((req: Context) =>
  sizeRepository.show(req.params.uuid).then((size) => ({
    body: {
      message: 'success',
      result: size
    }
  }))
);

export const create = wrap((req: Context) =>
  sizeRepository.create(req.request).then((size) => ({
    body: {
      message: 'success',
      result: size
    }
  }))
);

export const update = wrap((req: Context) =>
  sizeRepository.update(req.request, req.params.uuid).then((size) => ({
    body: {
      message: 'success',
      result: size
    }
  }))
);

export const destroy = wrap((req: Context) =>
  sizeRepository.destroy(req.params.uuid).then((size) => ({
    body: {
      message: 'success',
      result: size
    }
  }))
);
