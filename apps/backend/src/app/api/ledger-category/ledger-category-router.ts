import Router from '@koa/router';
import * as controller from './ledger-category-controller';
import { CreateLedgerCategorySchema, UpdateLedgerCategorySchema } from 'domains/ledger-category/ledger-category-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/ledger-categories'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/paginate', controller.paginate);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateLedgerCategorySchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateLedgerCategorySchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
