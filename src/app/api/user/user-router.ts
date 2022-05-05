import Router from '@koa/router';
import * as controller from './user-controller';
import { CreateUserSchema } from 'domains/user/user-schema';
import { validate, locker } from 'app/middlewares';

const router = new Router({
  prefix: '/users'
})
  .use(locker.api());

router.post('/register', validate.body(CreateUserSchema), controller.register);
router.use(locker.api());

export default router;
