import listen from 'infra/listen';
import server from 'infra/server';
import { connection } from 'infra/database/connection';

listen(server)
  .then(async () => {
    await connection();
    console.log('success');
  })
  .catch((error) => {
    console.error('error', error);
  });
