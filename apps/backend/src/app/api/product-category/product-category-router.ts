import Router from '@koa/router';
import * as controller from './product-category-controller';
import { CreateProductCategorieSchema, UpdateProductCategorieSchema } from 'domains/product-category/product-category-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/product-categories'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/paginate', controller.paginate);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateProductCategorieSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateProductCategorieSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
