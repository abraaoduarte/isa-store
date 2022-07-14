import { Context } from 'koa';
import * as ledgerRepository from 'domains/ledger/ledger-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  ledgerRepository.index(req.query).then((ledger) => ({
    body: {
      message: 'success',
      ...ledger
    }
  }))
);

export const show = wrap((req: Context) =>
  ledgerRepository.show(req.params.uuid).then((ledger) => ({
    body: {
      message: 'success',
      result: ledger
    }
  }))
);

export const create = wrap((req: Context) =>
  ledgerRepository.create(req.request, req.state.user).then((ledger) => ({
    body: {
      message: 'success',
      result: ledger
    }
  }))
);

export const update = wrap((req: Context) =>
  ledgerRepository.update(req.request, req.params.uuid, req.state.user).then((ledger) => ({
    body: {
      message: 'success',
      result: ledger
    }
  }))
);

export const destroy = wrap((req: Context) =>
  ledgerRepository.destroy(req.params.uuid).then((ledger) => ({
    body: {
      message: 'success',
      result: ledger
    }
  }))
);
