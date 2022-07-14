import Router from '@koa/router';
import * as controller from './ledger-controller';
import { CreateLedgerSchema, UpdateLedgerSchema } from 'domains/ledger/ledger-schema';
import { validate, locker } from 'app/middlewares';
import { makeUuidSchema } from 'domains/common/common-schema';

const router = new Router({
  prefix: '/ledger'
})
  .use(locker.api());

router.get('/', controller.index);
router.get('/:uuid', validate.params(makeUuidSchema('uuid')), controller.show);
router.post('/', validate.body(CreateLedgerSchema), controller.create);
router.patch('/:uuid', validate.params(makeUuidSchema('uuid')), validate.body(UpdateLedgerSchema), controller.update);
router.delete('/:uuid', controller.destroy);

export default router;
