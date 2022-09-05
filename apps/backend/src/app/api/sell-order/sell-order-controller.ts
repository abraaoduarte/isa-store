import { Context } from 'koa';
import * as sellOrderRepository from 'domains/sell-order/sell-order-repository';
import { wrap } from 'utils/wrap';

export const index = wrap((req: Context) =>
  sellOrderRepository.index(req.query).then((sellOrders) => ({
    body: {
      message: 'success',
      ...sellOrders
    }
  }))
);

export const show = wrap((req: Context) =>
  sellOrderRepository.show(req.params.uuid).then((sellOrder) => ({
    body: {
      message: 'success',
      result: sellOrder
    }
  }))
);

export const create = wrap((req: Context) =>
  sellOrderRepository.create(req.request).then((sellOrder) => ({
    body: {
      message: 'success',
      result: sellOrder
    }
  }))
);

export const update = wrap((req: Context) =>
  sellOrderRepository.update(req.request, req.params.uuid).then((sellOrder) => ({
    body: {
      message: 'success',
      result: sellOrder
    }
  }))
);

export const destroy = wrap((req: Context) =>
  sellOrderRepository.destroy(req.params.uuid).then((sellOrder) => ({
    body: {
      message: 'success',
      result: sellOrder
    }
  }))
);
