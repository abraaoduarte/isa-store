import path from 'path';

const knexfile = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'docker',
      database: process.env.DB_NAME || 'postgres',
      port: process.env.DB_POST || '5432',
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

export default knexfile;
