import Koa from 'koa';
import routes from 'app/api';
import logger from 'koa-logger';

const server = new Koa();

server.use(logger());
server.use(routes.routes()).use(routes.allowedMethods());

export default server;
