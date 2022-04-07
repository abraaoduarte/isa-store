import listen from 'infra/listen';
import server from 'infra/server';
import { connection } from 'infra/database/connection';
import logger from 'utils/logger';
listen(server)
  .then(async () => {
    await connection();
    logger.info('success');
  })
  .catch((error) => {
    logger.error('error', error);
  });
