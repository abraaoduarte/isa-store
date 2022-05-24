import Router from '@koa/router';
import * as controller from './product-variation-controller';
import { CreateProductVariationSchema, UpdateProductVariationSchema } from 'domains/product-variation/product-variation-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/product-variations'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateProductVariationSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateProductVariationSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
