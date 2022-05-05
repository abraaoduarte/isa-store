import listen from 'infra/listen';
import server from 'infra/server';
import { connection } from 'infra/database/connection';
import logger from 'utils/logger';
import env from 'utils/env';
listen(server)
  .then(async () => {
    await connection();
    logger.info('DATABASE CONNECTED');
    logger.info(`PORT: ${env('PORT', '3001')}`);
    logger.info(`URL: http://localhost:${env('PORT', '3001')}`);
    logger.info('SERVER STARTED');
  })
  .catch((error) => {
    logger.error('error', error);
  });
