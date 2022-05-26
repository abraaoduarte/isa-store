import Koa from 'koa';
import routes from 'app/api';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import koaBody from 'koa-body';
import cors from '@koa/cors';

const server = new Koa();

server.use(cors());
server.use(helmet());
server.use(logger());
server.use(koaBody())
  .use(routes.routes())
  .use(routes.allowedMethods());

export default server;
