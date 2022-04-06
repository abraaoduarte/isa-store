import Koa from 'koa';
import routes from 'app/api';

const server = new Koa();

server.use(routes.routes()).use(routes.allowedMethods());

export default server;
