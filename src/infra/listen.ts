import * as http from 'http';
import type Koa from 'koa';
import env from 'utils/env';

function listen (
  handler: Koa,
  { port = env('PORT', '3001') } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    http
      .createServer(handler.callback())
      .listen(port)
      .once('listening', resolve)
      .once('error', reject);
  });
}

export default listen;
