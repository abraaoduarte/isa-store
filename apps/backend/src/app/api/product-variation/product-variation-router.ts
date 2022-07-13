import Router from '@koa/router';
import * as controller from './product-variation-controller';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/product-variations'
})
  .use(locker.api());

router.delete('/:uuid', validate.params(makeUuidSchema('uuid')), controller.destroy);

export default router;
