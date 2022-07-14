import { Context } from 'koa';
import * as ledgerCategoryRepository from 'domains/ledger-category/ledger-category-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  ledgerCategoryRepository.index().then((ledgerCategories) => ({
    body: {
      message: 'success',
      ...ledgerCategories
    }
  }))
);

export const paginate = wrap((req: Context) =>
  ledgerCategoryRepository.paginate(req.query).then((ledgerCategory) => ({
    body: {
      message: 'success',
      ...ledgerCategory
    }
  }))
);

export const show = wrap((req: Context) =>
  ledgerCategoryRepository.show(req.params.uuid).then((ledgerCategory) => ({
    body: {
      message: 'success',
      result: ledgerCategory
    }
  }))
);

export const create = wrap((req: Context) =>
  ledgerCategoryRepository.create(req.request).then((ledgerCategory) => ({
    body: {
      message: 'success',
      result: ledgerCategory
    }
  }))
);

export const update = wrap((req: Context) =>
  ledgerCategoryRepository.update(req.request, req.params.uuid).then((ledgerCategory) => ({
    body: {
      message: 'success',
      result: ledgerCategory
    }
  }))
);

export const destroy = wrap((req: Context) =>
  ledgerCategoryRepository.destroy(req.params.uuid).then((ledgerCategory) => ({
    body: {
      message: 'success',
      result: ledgerCategory
    }
  }))
);
