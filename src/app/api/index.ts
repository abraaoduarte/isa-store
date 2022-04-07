import Router from '@koa/router';
import authRouter from './auth/auth-router';

const router = new Router({
  prefix: '/api'
});

router.use(authRouter.routes());

export default router;
