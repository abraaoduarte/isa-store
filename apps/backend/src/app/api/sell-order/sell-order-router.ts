import Router from '@koa/router';
import * as controller from './sell-order-controller';
import { CreateSellOrderSchema, UpdateSellOrderSchema } from 'domains/sell-order/sell-order-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/sell-orders'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateSellOrderSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateSellOrderSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
