import Router from '@koa/router';
import * as controller from './user-controller';
import { CreateUserSchema } from 'domains/user/user-schema';
import { validate } from 'app/middlewares';

const router = new Router({
  prefix: '/users'
});

router.post('/register', validate.body(CreateUserSchema), controller.register);

export default router;
