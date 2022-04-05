import Koa from 'koa';
import routes from 'app/api';

const server = new Koa();

// server.use(async ctx => {
//   ctx.body = 'Hello World';
// });
server.use(routes.routes()).use(routes.allowedMethods());

export default server;
