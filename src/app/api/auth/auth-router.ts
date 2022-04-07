import Router from '@koa/router';

const router = new Router({
  prefix: '/auth'
});

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello Abraão Duarte';
});

export default router;
