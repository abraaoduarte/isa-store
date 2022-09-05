import Router from '@koa/router';
import authRouter from './auth/auth-router';
import userRouter from './user/user-router';
import brandRouter from './brand/brand-router';
import sizeRouter from './size/size-router';
import colorRouter from './color/color-router';
import productCategoryRouter from './product-category/product-category-router';
import productRouter from './product/product-router';
import productVariationRouter from './product-variation/product-variation-router';
import ledgerCategoryRouter from './ledger-category/ledger-category-router';
import ledgerRouter from './ledger/ledger-router';
import sellOrderRouter from './sell-order/sell-order-router';

const router = new Router({
  prefix: '/api'
});

router.use(authRouter.routes());
router.use(userRouter.routes());
router.use(brandRouter.routes());
router.use(sizeRouter.routes());
router.use(colorRouter.routes());
router.use(productCategoryRouter.routes());
router.use(productRouter.routes());
router.use(productVariationRouter.routes());
router.use(ledgerCategoryRouter.routes());
router.use(ledgerRouter.routes());
router.use(sellOrderRouter.routes());

export default router;
