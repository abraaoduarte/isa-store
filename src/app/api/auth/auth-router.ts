import Router from '@koa/router';
import { validate } from 'app/middlewares';
import { AuthSchema } from 'domains/auth/auth-schema';
import * as controller from './auth-controller';

const router = new Router({
  prefix: '/auth'
});

router.post('/login', validate.body(AuthSchema), controller.login);
router.post('/refresh', controller.refresh);

export default router;
