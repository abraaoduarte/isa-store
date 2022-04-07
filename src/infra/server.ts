import Koa from 'koa';
import routes from 'app/api';
import logger from 'koa-logger';
import helmet from 'koa-helmet';

const server = new Koa();

server.use(helmet());
server.use(logger());
server.use(routes.routes()).use(routes.allowedMethods());

export default server;
