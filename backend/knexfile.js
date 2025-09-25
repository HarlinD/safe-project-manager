// knexfile.js
const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5448,
      database: process.env.DB_NAME || 'safe_pm_dev',
      user: process.env.DB_USER || 'safe_user',
      password: process.env.DB_PASSWORD || 'safe_password',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5447,
      database: process.env.DB_NAME || 'safe_pm',
      user: process.env.DB_USER || 'safe_user',
      password: process.env.DB_PASSWORD || 'safe_password',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5449,
      database: process.env.DB_NAME || 'safe_pm_test',
      user: process.env.DB_USER || 'safe_user',
      password: process.env.DB_PASSWORD || 'safe_password',
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  }
};
