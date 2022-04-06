import path from 'path';

export const settings = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'docker',
      database: 'postgres',
      port: '5432',
    },
    migrations: {
      tableName: 'migrations',
      directory: path.join(__dirname, '/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/seeds'),
    },
  },
};
