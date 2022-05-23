import Router from '@koa/router';
import authRouter from './auth/auth-router';
import userRouter from './user/user-router';
import brandRouter from './brand/brand-router';
import sizeRouter from './size/size-router';

const router = new Router({
  prefix: '/api'
});

router.use(authRouter.routes());
router.use(userRouter.routes());
router.use(brandRouter.routes());
router.use(sizeRouter.routes());

export default router;
