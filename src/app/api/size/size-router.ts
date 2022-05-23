import Router from '@koa/router';
import * as controller from './size-controller';
import { CreateSizeSchema, UpdateSizeSchema } from 'domains/size/size-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/sizes'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateSizeSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateSizeSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
