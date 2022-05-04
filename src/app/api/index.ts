import Router from '@koa/router';
import authRouter from './auth/auth-router';
import userRouter from './user/user-router';

const router = new Router({
  prefix: '/api'
});

router.use(authRouter.routes());
router.use(userRouter.routes());

export default router;
