import Router from '@koa/router';
import { CreateBrandSchema, UpdateBrandSchema } from 'domains/brand/brand-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';
import * as controller from './brand-controller';

const router = new Router({
  prefix: '/brands'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/paginate', controller.paginate);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateBrandSchema), controller.create);
router.patch(
  '/:uuid',
  validate.params(makeUuidSchema('uuid')),
  validate.body(UpdateBrandSchema, { canBeEmpty: false }),
  controller.update
);
router.delete('/:uuid', validate.params(makeUuidSchema('uuid')), controller.destroy);

export default router;
