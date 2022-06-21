import Router from '@koa/router';
import * as controller from './color-controller';
import { CreateColorSchema, UpdateColorSchema } from 'domains/color/color-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/colors'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/paginate', controller.paginate);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateColorSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateColorSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
