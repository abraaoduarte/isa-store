import Koa from 'koa';
import routes from 'app/api';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import koaBody from 'koa-body';

const server = new Koa();

server.use(helmet());
server.use(logger());
server.use(koaBody())
  .use(routes.routes())
  .use(routes.allowedMethods());

export default server;
