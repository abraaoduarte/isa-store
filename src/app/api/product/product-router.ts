import Router from '@koa/router';
import * as controller from './product-controller';
import { CreateProductSchema, UpdateProductSchema } from 'domains/product/product-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/products'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateProductSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateProductSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
