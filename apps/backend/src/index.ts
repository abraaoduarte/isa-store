import listen from 'infra/listen';
import server from 'infra/server';
import logger from 'utils/logger';
import env from 'utils/env';

listen(server)
  .then(async () => {
    logger.info(`PORT: ${env('PORT', '3001')}`);
    logger.info(`URL: http://localhost:${env('PORT', '3001')}`);
    logger.info('SERVER STARTED');
  })
  .catch((error) => {
    logger.error('error', error);
  });
