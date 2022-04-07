import * as http from 'http';
import type Koa from 'koa';

function listen (handler: Koa, { port = 5999 } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    http
      .createServer(handler.callback())
      .listen(port)
      .once('listening', resolve)
      .once('error', reject);
  });
}

export default listen;
