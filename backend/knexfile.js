if (process.env.NODE_ENV !== 'production')
  require('dotenv-safe').config({ allowEmptyValues: true });

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_DEV_HOST,
      database: process.env.DB_DEV_NAME,
      user: process.env.DB_DEV_USERNAME,
      password: process.env.DB_DEV_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    asyncStackTraces: true,
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    asyncStackTraces: true,
  },
};
