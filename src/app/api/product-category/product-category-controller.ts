import { Context } from 'koa';
import * as productCategoryRepository from 'domains/product-category/product-category-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  productCategoryRepository.index(req.query).then((productCategories) => ({
    body: {
      message: 'success',
      ...productCategories
    }
  }))
);

export const show = wrap((req: Context) =>
  productCategoryRepository.show(req.params.uuid).then((productCategory) => ({
    body: {
      message: 'success',
      result: productCategory
    }
  }))
);

export const create = wrap((req: Context) =>
  productCategoryRepository.create(req.request).then((productCategory) => ({
    body: {
      message: 'success',
      result: productCategory
    }
  }))
);

export const update = wrap((req: Context) =>
  productCategoryRepository.update(req.request, req.params.uuid).then((productCategory) => ({
    body: {
      message: 'success',
      result: productCategory
    }
  }))
);

export const destroy = wrap((req: Context) =>
  productCategoryRepository.destroy(req.params.uuid).then((productCategory) => ({
    body: {
      message: 'success',
      result: productCategory
    }
  }))
);
