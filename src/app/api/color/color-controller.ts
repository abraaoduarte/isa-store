import { Context } from 'koa';
import * as colorRepository from 'domains/color/color-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  colorRepository.index(req.query).then((colors) => ({
    body: {
      message: 'success',
      ...colors
    }
  }))
);

export const show = wrap((req: Context) =>
  colorRepository.show(req.params.uuid).then((color) => ({
    body: {
      message: 'success',
      result: color
    }
  }))
);

export const create = wrap((req: Context) =>
  colorRepository.create(req.request).then((color) => ({
    body: {
      message: 'success',
      result: color
    }
  }))
);

export const update = wrap((req: Context) =>
  colorRepository.update(req.request, req.params.uuid).then((color) => ({
    body: {
      message: 'success',
      result: color
    }
  }))
);

export const destroy = wrap((req: Context) =>
  colorRepository.destroy(req.params.uuid).then((color) => ({
    body: {
      message: 'success',
      result: color
    }
  }))
);
